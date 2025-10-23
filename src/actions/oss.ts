'use server'

import { del, head, put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export async function uploadFile(formData: FormData) {
  const filePath = formData.get('path') as string // 文件路径可以多层级,会自动创建文件夹 eg: 'images/avatars/123.jpg'
  const imageFile = formData.get('image') as File // 使用 image 字段名
  const blob = await put(filePath, imageFile, { access: 'public', addRandomSuffix: true })

  revalidatePath('/')
  return blob
}

export async function getFile(url: string) {
  const blob = await head(url)
  return blob
}

export async function deleteFile(url: string) {
  await del(url)
}
