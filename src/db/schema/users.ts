import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  password: text(),
  nickname: text(),
  avatar: text(),
  role: text(),
  config: jsonb().$type<Record<string, any>>().default({}),
  masterKey: text('master_key').default(''), // 主密钥，用于解密用户的密码

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type User = typeof users.$inferSelect
export type UserInsertDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UserUpdateDTO = UserInsertDTO & { id: User['id'] }
