'use server'

import { db } from '@/db'
import { PasswordInsertDTO, passwords, PasswordUpdateDTO } from '@/db/schema/passwords'
import { aesDecrypt, aesEncrypt } from '@/utils/aes-encrypt.server'
import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import { getUserInfo } from './user'

const generateIV = () => Math.random().toString(36).slice(2, 10)

export async function getItems() {
  const currentUser = await getUserInfo()
  if (!currentUser) {
    throw new Error('User not found')
  }

  const cols = omit(getTableColumns(passwords), ['password', 'iv'])
  const res = await db
    .select(cols)
    .from(passwords)
    .where(eq(passwords.uid, currentUser.id))
    .orderBy(desc(passwords.updatedAt))
  return res
}

export async function getItemById(id: string) {
  const currentUser = await getUserInfo()
  if (!currentUser) {
    throw new Error('User not found')
  }

  const [item] = await db
    .select()
    .from(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  if (!item) {
    throw new Error('Password not found')
  }

  const { password, iv, ...rest } = item
  const decrypted = aesDecrypt(password || '', currentUser.masterKey || '', iv)
  return { ...rest, password: decrypted }
}

export async function createItem(data: PasswordInsertDTO) {
  const currentUser = await getUserInfo()
  if (!currentUser) {
    throw new Error('User not found')
  }

  const { password, ...rest } = data
  const iv = generateIV()
  const encrypted = aesEncrypt(password || '', currentUser.masterKey || '', iv)

  const [created] = await db
    .insert(passwords)
    .values({
      ...rest,
      uid: currentUser.id,
      password: encrypted,
      iv
    })
    .returning()

  return created.id
}

export async function updateItem(data: PasswordUpdateDTO) {
  const currentUser = await getUserInfo()
  if (!currentUser) {
    throw new Error('User not found')
  }

  const { id, password, ...rest } = data
  const [item] = await db
    .select()
    .from(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  if (!item) {
    throw new Error('Password not found')
  }

  const encrypted = aesEncrypt(password || '', currentUser.masterKey || '', item.iv)
  const updated = { ...rest, password: encrypted }

  await db
    .update(passwords)
    .set(updated)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  return item.id
}

export async function removeItem(id: string) {
  const currentUser = await getUserInfo()
  if (!currentUser) {
    throw new Error('User not found')
  }

  const [item] = await db
    .select()
    .from(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  if (!item) {
    throw new Error('Password not found')
  }

  await db.delete(passwords).where(and(eq(passwords.id, id), eq(passwords.uid, currentUser.id)))

  return item.id
}
