import crypto from 'node:crypto'

// 定义加密算法和所需的 key 和 iv 长度
const algorithm = 'aes-256-cbc'
const KEY_LENGTH = 32 // 32 字节的密钥（256 位）
const IV_LENGTH = 16 // 16 字节的初始化向量（128 位）

// 加密函数，支持任意类型的数据
export function aesEncrypt<T = any>(data: T, key: string, iv: string): string {
  // 将 key 和 iv 转换为固定长度的 Buffer
  const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key.padEnd(KEY_LENGTH, '0').slice(0, KEY_LENGTH))
  const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv.padEnd(IV_LENGTH, '0').slice(0, IV_LENGTH))

  // 将数据序列化为 JSON 字符串
  const jsonData = JSON.stringify(data)

  const cipher = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer)
  let encrypted = cipher.update(jsonData, 'utf-8', 'hex')
  encrypted += cipher.final('hex')

  // 返回加密后的密文
  return encrypted
}

// 解密函数，支持任意类型的数据
export function aesDecrypt<T = any>(encryptedData: string, key: string, iv: string): T {
  // 将 key 和 iv 转换为固定长度的 Buffer
  const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key.padEnd(KEY_LENGTH, '0').slice(0, KEY_LENGTH))
  const ivBuffer = Buffer.isBuffer(iv) ? iv : Buffer.from(iv.padEnd(IV_LENGTH, '0').slice(0, IV_LENGTH))

  const decipher = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer)
  let decrypted = decipher.update(encryptedData, 'hex', 'utf-8')
  decrypted += decipher.final('utf-8')

  // 将解密后的 JSON 字符串转换回原始数据类型
  return JSON.parse(decrypted)
}
