'use server'

import ResetPasswordEmail from '@/components/ResetPasswordEmail'
import { db } from '@/db'
import { User, UserInsertDTO, users } from '@/db/schema/users'
import { generatePassword } from '@/utils/gen-password'
import { hashContent, verifyContent } from '@/utils/hash.server'
import { render } from '@react-email/render'
import { eq } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function registerUser(user: UserInsertDTO) {
  const existingUser = await db.select().from(users).where(eq(users.email, user.email))

  if (existingUser.length > 0) {
    throw new Error('Email already registered')
  }

  const { password, ...rest } = user
  const hashedPassword = await hashContent(password || '')
  const masterKey = generatePassword()
  await db.insert(users).values({ ...rest, password: hashedPassword, masterKey })
}

export async function loginUser(email: string, password: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user) {
      throw new Error('Email not registered')
    }

    const isPasswordCorrect = await verifyContent(password, user.password || '')
    if (!isPasswordCorrect) {
      throw new Error('Incorrect password')
    }

    const token = jwt.sign({ uid: user.id, email }, process.env.JWT_SECRET || '', { expiresIn: '1d' })
    const cookieStore = await cookies()
    cookieStore.set('token', token)
    revalidatePath('/')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Login failed')
    }
  }
}

export async function getUserInfo(isAllFields = true) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    throw new Error('No token found')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as { uid: string; email: string }
    const [user] = await db.select().from(users).where(eq(users.id, decoded.uid))

    if (!user) {
      throw new Error('User not found')
    }

    return omit(user, isAllFields ? [] : ['password', 'masterKey'])
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Invalid token')
    }
  }
}

export async function updateUser(user: Partial<Pick<User, 'nickname' | 'email' | 'avatar'>>) {
  const currentUser = await getUserInfo()
  if (!currentUser) {
    throw new Error('User not found')
  }

  const updated = { ...user, updatedAt: new Date() }
  await db.update(users).set(updated).where(eq(users.id, currentUser.id))
}

export async function updateUserPassword(values: { oldPassword: string; newPassword: string }) {
  const currentUser = (await getUserInfo(true)) as User

  const isPasswordCorrect = await verifyContent(values.oldPassword, currentUser.password || '')
  if (!isPasswordCorrect) {
    throw new Error('Incorrect password')
  }

  const hashedPassword = await hashContent(values.newPassword || '')
  await db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.id, currentUser.id))

  const cookieStore = await cookies()
  cookieStore.delete('token')
}

export async function sendResetPasswordEmail(email: string) {
  const sign = jwt.sign({ email }, process.env.JWT_SECRET || '', { expiresIn: '1h' })

  const headerList = await headers()
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const host = headerList.get('host')
  const baseUrl = `${protocol}://${host}`
  const resetUrl = `${baseUrl}/reset-password?sign=${sign}`

  const { error } = await resend.emails.send({
    from: 'orzpass <onboarding@resend.dev>',
    to: [email],
    subject: 'Reset Password',
    html: await render(ResetPasswordEmail({ resetUrl }))
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function resetPassword(sign: string, newPassword: string) {
  try {
    const decoded = jwt.verify(sign, process.env.JWT_SECRET || '') as { email: string }

    const [user] = await db.select().from(users).where(eq(users.email, decoded.email))

    if (!user) {
      throw new Error('User not found')
    }

    const hashedPassword = await hashContent(newPassword || '')
    await db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.id, user.id))

    const cookieStore = await cookies()
    cookieStore.delete('token')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('Reset password failed')
    }
  }
}
