'use client'

import { getItems } from '@/actions/items'
import CardItem from '@/components/CardItem'
import LoadingView from '@/components/LoadingView'
import { Password } from '@/db/schema/passwords'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Button, Input } from 'antd'
import { isNil } from 'es-toolkit'
import Link from 'next/link'
import { useDeferredValue, useMemo, useState } from 'react'

export default function ListPage() {
  const [text, setText] = useState('')
  const keyword = useDeferredValue(text)

  const { data: items, isFetching } = useQuery({
    queryKey: ['passwords'],
    queryFn: () => getItems()
  })

  const list = useMemo(() => {
    if (isNil(items)) {
      return []
    }

    const matchFields = ['title', 'username', 'website']
    return items?.filter((item) =>
      matchFields.some((field) => {
        const value = item[field as keyof Omit<Password, 'password' | 'iv'>] as string
        return value?.toLowerCase().includes(keyword)
      })
    )
  }, [items, keyword])

  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Passwords' }]} />

      <header className="mt-4 flex w-xl gap-2">
        <Input placeholder="Search" value={text} onChange={(e) => setText(e.target.value)} maxLength={30} allowClear />
        <Link href="/pwd/add">
          <Button type="primary">Add</Button>
        </Link>
      </header>

      {isFetching && <LoadingView />}

      <ul className="mt-4 grid gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {list.map((item) => (
          <li key={item.id}>
            <CardItem data={item} />
          </li>
        ))}
      </ul>
    </>
  )
}
