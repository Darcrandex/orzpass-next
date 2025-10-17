import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const passwords = pgTable('passwords', {
  id: uuid().primaryKey().defaultRandom(),
  uid: uuid()
    .notNull()
    .references(() => users.id),

  title: text().notNull(),
  username: text(),
  password: text().default(''),
  website: text(),
  icon: text(),
  remark: text(),
  iv: text().notNull(), // 加密用的 iv

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export type Password = typeof passwords.$inferSelect
export type PasswordInsertDTO = Omit<Password, 'id' | 'createdAt' | 'updatedAt' | 'iv'>
export type PasswordUpdateDTO = PasswordInsertDTO & { id: Password['id'] }
