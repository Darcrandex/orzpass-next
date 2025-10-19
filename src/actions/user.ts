'use server'

import { db } from '@/db'
import { User, UserInsertDTO, users } from '@/db/schema/users'
import { generatePassword } from '@/utils/gen-password'
import { hashContent, verifyContent } from '@/utils/hash.server'
import { eq } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import jwt from 'jsonwebtoken'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

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

    const token = jwt.sign({ uid: user.id, email }, process.env.JWT_SECRET || '', { expiresIn: '1h' })
    const cookieStore = await cookies()
    cookieStore.set('token', token)
    revalidatePath('/')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Login failed')
    }
  }
}

export async function getUserInfo(excludePassword = true) {
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

    return omit(user, excludePassword ? ['password'] : [])
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Invalid token')
    }
  }
}

export async function updateUser(user: Pick<User, 'id' | 'nickname' | 'email'>) {
  const currentUser = await getUserInfo()
  if (!currentUser) {
    throw new Error('User not found')
  }

  await db.update(users).set(user).where(eq(users.id, currentUser.id))
}

export async function updateUserPassword(values: { oldPassword: string; newPassword: string }) {
  const currentUser = (await getUserInfo(false)) as User

  const isPasswordCorrect = await verifyContent(values.oldPassword, currentUser.password || '')
  if (!isPasswordCorrect) {
    throw new Error('Incorrect password')
  }

  const hashedPassword = await hashContent(values.newPassword || '')
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, currentUser.id))

  const cookieStore = await cookies()
  cookieStore.delete('token')
}
