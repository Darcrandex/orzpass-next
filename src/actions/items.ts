'use server'

import { db } from '@/db'
import { PasswordInsertDTO, passwords, PasswordUpdateDTO } from '@/db/schema/passwords'
import { User } from '@/db/schema/users'
import { aesDecrypt, aesEncrypt } from '@/utils/aes-encrypt.server'
import * as cheerio from 'cheerio'
import { and, desc, eq, getTableColumns } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import { headers } from 'next/headers'
import { getUserInfo } from './user'

const generateIV = () => Math.random().toString(36).slice(2, 10)

const getWebsiteIconUrl = async (url?: string | null) => {
  if (!url || url.trim() === '') {
    return undefined
  }

  try {
    const targetUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`
    const parsedUrl = new URL(targetUrl)
    const hostname = parsedUrl.hostname
    const domainUrl = `https://${hostname}`
    const headerStore = await headers()
    const agent = headerStore.get('user-agent')?.toString() || ''

    const res = await fetch(domainUrl, { headers: { 'User-Agent': agent, Referer: domainUrl } })
    const html = await res.text()
    const $ = cheerio.load(html)

    // 尝试查找 logo 的优先级顺序
    const logoSelectors = [
      // 标准 favicon
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      // Apple touch icon
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      // Open Graph 图片
      'meta[property="og:image"]',
      // Twitter 卡片图片
      'meta[name="twitter:image"]'
    ]

    let logoUrl: string | undefined = undefined

    // 按优先级查找 logo
    for (const selector of logoSelectors) {
      const element = $(selector).last()
      if (element.length) {
        if (selector.includes('link')) {
          logoUrl = element.attr('href')
        } else {
          logoUrl = element.attr('content')
        }

        if (logoUrl) break
      }
    }

    if (!logoUrl) {
      const faviconUrl = `${parsedUrl.protocol}//${hostname}/favicon.ico`
      try {
        const faviconResponse = await fetch(faviconUrl)
        if (faviconResponse.status === 200) {
          logoUrl = faviconUrl
        }
      } catch (error) {
        console.log('没有找到默认的 favicon.ico', error)
      }
    }

    // 真没有
    if (!logoUrl) {
      throw new Error('没有找到 logo')
    }

    // 确保 logo URL 是绝对路径
    if (logoUrl.startsWith('//')) {
      logoUrl = parsedUrl.protocol + logoUrl
    } else if (logoUrl.startsWith('/')) {
      logoUrl = `${parsedUrl.protocol}//${hostname}${logoUrl}`
    } else if (!logoUrl.startsWith('http')) {
      logoUrl = new URL(logoUrl, targetUrl).href
    }

    return logoUrl
  } catch (error) {
    console.log('error', error)
    return undefined
  }
}

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
  const currentUser = (await getUserInfo(true)) as User
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
  const currentUser = (await getUserInfo(true)) as User
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
      icon: await getWebsiteIconUrl(rest.website),
      iv
    })
    .returning()

  return created.id
}

export async function updateItem(data: PasswordUpdateDTO) {
  const currentUser = (await getUserInfo(true)) as User
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
  const updated = {
    ...rest,
    password: encrypted,
    icon: rest.website !== item.website ? await getWebsiteIconUrl(rest.website) : item.icon,
    updatedAt: new Date()
  }

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
