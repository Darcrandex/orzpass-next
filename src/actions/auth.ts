'use server'

import { db } from '@/db'
import { users, UserUpdateDTO, type UserInsertDTO } from '@/db/schema/users'
import { hashContent, verifyContent } from '@/utils/hash.server'
import { eq } from 'drizzle-orm'
import { delay, omit } from 'es-toolkit'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createUser(user: UserInsertDTO) {
  const existingUser = await db.select().from(users).where(eq(users.email, user.email))

  if (existingUser.length > 0) {
    throw new Error('Email already registered')
  }

  const { password, ...rest } = user
  const hashedPassword = await hashContent(password || '')
  await db.insert(users).values({ ...rest, password: hashedPassword })
}

export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email))

  if (!user) {
    throw new Error('Email not registered')
  }

  const isPasswordCorrect = await verifyContent(password, user.password || '')
  if (!isPasswordCorrect) {
    throw new Error('Incorrect password')
  }

  const token = user.id
  const cookieStore = await cookies()
  cookieStore.set('token', token)
}

export async function updateUser(user: UserUpdateDTO) {
  await db.update(users).set(user).where(eq(users.id, user.id))
}

export async function sendResetPasswordEmail(email: string) {
  await delay(1000)
  console.log('send reset password email to', email)
}

export async function resetPassword(token: string, password: string) {
  await delay(1000)
  console.log('reset password with token', token, 'to', password)
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies()
    const uid = cookieStore.get('token')?.value || ''
    const [user] = await db.select().from(users).where(eq(users.id, uid))
    return omit(user, ['password'])
  } catch (error) {
    console.log('get user info error', error)
    redirect('/login')
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  redirect('/login')
}
