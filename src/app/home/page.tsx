/**
 * 主面板首页, 也是密码管理页面
 */

import { db } from '@/db'
import { passwords } from '@/db/schema/passwords'
import { Button } from 'antd'
import Link from 'next/link'

export default async function Home() {
  const list = await db.select().from(passwords)

  return (
    <div>
      <h1>password manager</h1>

      <header className="m-4">
        <Link href="/home/pwd/add" className="rounded-md border border-blue-500 px-2 py-1 text-blue-500">
          Add Password
        </Link>

        <Button>123</Button>
      </header>

      <hr className="my-4 border-b border-gray-300" />

      <ul className="m-4 rounded-md bg-amber-100 p-4">
        {list.map((item) => (
          <li key={item.id}>
            <p>{item.title}</p>
            <Link href={`/home/pwd/${item.id}`} className="rounded-md border border-blue-500 px-2 py-1 text-blue-500">
              Detail
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
