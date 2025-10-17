'use server'

import { db } from '@/db'
import { PasswordInsertDTO, passwords, PasswordUpdateDTO } from '@/db/schema/passwords'
import { aesDecrypt, aesEncrypt } from '@/utils/aes-encrypt.server'
import { and, eq, getTableColumns } from 'drizzle-orm'
import { isNil, omit } from 'es-toolkit'
import { getUserInfo } from './auth'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''
const generateIV = () => Math.random().toString(36).slice(2, 10)

export async function getUserPasswords() {
  const currentUser = await getUserInfo()

  const cols = omit(getTableColumns(passwords), ['password', 'iv'])
  const passwordsList = await db.select(cols).from(passwords).where(eq(passwords.uid, currentUser.id))
  return passwordsList
}

export async function createPassword(data: PasswordInsertDTO) {
  const currentUser = await getUserInfo()

  const { password, ...rest } = data
  const iv = generateIV()
  const encrypted = aesEncrypt(password || '', ENCRYPTION_KEY, iv)
  await db.insert(passwords).values({
    ...rest,
    uid: currentUser.id,
    password: encrypted,
    iv
  })
}

export async function updatePassword(params: PasswordUpdateDTO) {
  const currentUser = await getUserInfo()

  const { id, password, ...rest } = params
  const [data] = await db
    .select()
    .from(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  if (!data) {
    throw new Error('Password not found')
  }

  const encrypted = aesEncrypt(password || '', ENCRYPTION_KEY, data.iv)
  const updated = { ...rest, password: encrypted }

  await db
    .update(passwords)
    .set(updated)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))
}

export async function removePassword(id: string) {
  const currentUser = await getUserInfo()

  const [data] = await db
    .select()
    .from(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  if (isNil(data)) {
    throw new Error('Password not found')
  }

  await db.delete(passwords).where(eq(passwords.id, id))
}

export async function getPasswordDetail(id: string) {
  const currentUser = await getUserInfo()

  const [data] = await db
    .select()
    .from(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  if (isNil(data)) {
    throw new Error('Password not found')
  }

  const decrypted = aesDecrypt<string>(data.password || '', ENCRYPTION_KEY, data.iv || '')
  return omit({ ...data, password: decrypted }, ['iv'])
}
