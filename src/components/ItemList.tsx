'use client'

import { Password } from '@/db/schema/passwords'
import { Button, Input } from 'antd'
import Link from 'next/link'
import { useDeferredValue, useMemo, useState } from 'react'
import CardItem from './CardItem'

export default function ItemList(props: { data: Omit<Password, 'password' | 'iv'>[] }) {
  const [text, setText] = useState('')
  const keyword = useDeferredValue(text)

  const list = useMemo(() => {
    const matchFields = ['title', 'username', 'website']
    return props.data.filter((item) =>
      matchFields.some((field) => {
        const value = item[field as keyof Omit<Password, 'password' | 'iv'>] as string
        return value?.toLowerCase().includes(keyword)
      })
    )
  }, [props.data, keyword])

  return (
    <>
      <header className="mt-4 flex w-xl gap-2">
        <Input placeholder="Search" value={text} onChange={(e) => setText(e.target.value)} maxLength={30} allowClear />
        <Link href="/home/pwd/add">
          <Button>Add</Button>
        </Link>
      </header>

      <ul className="mt-4 grid gap-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {list.map((item) => (
          <li key={item.id}>
            <CardItem data={item} />
          </li>
        ))}
      </ul>

      {props.data.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-500">
          <span className="text-sm text-gray-500">No items found</span>
          <Link href="/home/pwd/add">
            <Button type="link">Add a new item</Button>
          </Link>
        </p>
      )}
    </>
  )
}
