/**
 * 密码生成器
 * 提供可定制的密码生成功能，支持不同字符集和密码强度
 */

// 定义字符集
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

// 密码选项接口
export interface PasswordOptions {
  length: number // 密码长度
  includeLowercase: boolean // 包含小写字母
  includeUppercase: boolean // 包含大写字母
  includeNumbers: boolean // 包含数字
  includeSymbols: boolean // 包含特殊符号
  excludeSimilarCharacters?: boolean // 排除容易混淆的字符，如 1, l, I, 0, O 等
  excludeAmbiguousCharacters?: boolean // 排除特殊符号，如 {}, [], (), /, \ 等
}

// 默认密码选项
export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 12, // 密码长度
  includeLowercase: true,
  includeUppercase: true,
  includeNumbers: true,
  includeSymbols: false,
  excludeSimilarCharacters: false,
  excludeAmbiguousCharacters: true
}

/**
 * 生成随机密码
 * @param options 密码生成选项
 * @returns 生成的密码
 */
export function generatePassword(options: Partial<PasswordOptions> = {}): string {
  // 合并默认选项
  const mergedOptions: PasswordOptions = {
    ...DEFAULT_PASSWORD_OPTIONS,
    ...options
  }

  // 验证选项
  if (mergedOptions.length < 4) {
    throw new Error('密码长度必须至少为4个字符')
  }

  if (
    !mergedOptions.includeLowercase &&
    !mergedOptions.includeUppercase &&
    !mergedOptions.includeNumbers &&
    !mergedOptions.includeSymbols
  ) {
    throw new Error('至少需要选择一种字符类型')
  }

  // 构建字符集
  let charset = ''
  const mustIncludeChars = []

  if (mergedOptions.includeLowercase) {
    let chars = LOWERCASE
    if (mergedOptions.excludeSimilarCharacters) {
      chars = chars.replace(/[lo]/g, '')
    }
    charset += chars
    mustIncludeChars.push(getRandomChar(chars))
  }

  if (mergedOptions.includeUppercase) {
    let chars = UPPERCASE
    if (mergedOptions.excludeSimilarCharacters) {
      chars = chars.replace(/[IO]/g, '')
    }
    charset += chars
    mustIncludeChars.push(getRandomChar(chars))
  }

  if (mergedOptions.includeNumbers) {
    let chars = NUMBERS
    if (mergedOptions.excludeSimilarCharacters) {
      chars = chars.replace(/[01]/g, '')
    }
    charset += chars
    mustIncludeChars.push(getRandomChar(chars))
  }

  if (mergedOptions.includeSymbols) {
    let chars = SYMBOLS
    if (mergedOptions.excludeAmbiguousCharacters) {
      chars = chars.replace(/[[\]{}()<>\\/'"~,;:.-]/g, '')
    }
    charset += chars
    mustIncludeChars.push(getRandomChar(chars))
  }

  // 生成密码
  let password = ''

  // 确保每种选择的字符类型至少包含一个字符
  for (let i = 0; i < mustIncludeChars.length; i++) {
    password += mustIncludeChars[i]
  }

  // 填充剩余长度
  for (let i = mustIncludeChars.length; i < mergedOptions.length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  // 打乱密码顺序
  return shuffleString(password)
}

/**
 * 从字符串中随机选择一个字符
 * @param str 源字符串
 * @returns 随机字符
 */
function getRandomChar(str: string): string {
  return str.charAt(Math.floor(Math.random() * str.length))
}

/**
 * 打乱字符串顺序
 * @param str 源字符串
 * @returns 打乱后的字符串
 */
function shuffleString(str: string): string {
  const array = str.split('')
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array.join('')
}

/**
 * 评估密码强度
 * @param password 要评估的密码
 * @returns 密码强度评分（0-100）和级别描述
 */
export function evaluatePasswordStrength(password: string): { score: number; level: string } {
  if (!password) {
    return { score: 0, level: '无' }
  }

  let score = 0

  // 基础分数：长度
  if (password.length >= 12) {
    score += 25
  } else if (password.length >= 8) {
    score += 15
  } else if (password.length >= 6) {
    score += 10
  } else {
    score += 5
  }

  // 字符多样性
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 10
  if (/[^a-zA-Z0-9]/.test(password)) score += 20

  // 复杂性评分
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^a-zA-Z0-9]/.test(password)

  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length

  if (variety >= 3) score += 20
  else if (variety === 2) score += 10

  // 确保分数不超过100
  score = Math.min(score, 100)

  // 确定强度级别
  let level = '弱'
  if (score >= 80) level = '非常强'
  else if (score >= 60) level = '强'
  else if (score >= 40) level = '中等'
  else if (score >= 20) level = '弱'
  else level = '非常弱'

  return { score, level }
}

/**
 * 生成记忆性强的密码（使用单词组合）
 * 注意：这只是一个简化版本，实际应用中可能需要一个单词库
 * @param options 选项
 * @returns 生成的密码
 */
export function generateMemorablePassword(
  options: {
    wordCount?: number
    separator?: string
    includeNumber?: boolean
  } = {}
): string {
  // 这里使用一个简单的单词列表作为示例
  // 实际应用中应该使用更大的词库或API
  const words = [
    'apple',
    'banana',
    'orange',
    'grape',
    'lemon',
    'coffee',
    'water',
    'juice',
    'milk',
    'tea',
    'dog',
    'cat',
    'bird',
    'fish',
    'lion',
    'book',
    'desk',
    'chair',
    'table',
    'door',
    'sun',
    'moon',
    'star',
    'cloud',
    'rain'
  ]

  const { wordCount = 3, separator = '-', includeNumber = true } = options

  let password = ''

  // 选择随机单词
  for (let i = 0; i < wordCount; i++) {
    const word = words[Math.floor(Math.random() * words.length)]
    // 首字母大写
    password += word.charAt(0).toUpperCase() + word.slice(1)

    if (i < wordCount - 1) {
      password += separator
    }
  }

  // 添加随机数字
  if (includeNumber) {
    password += separator + Math.floor(Math.random() * 1000)
  }

  return password
}
