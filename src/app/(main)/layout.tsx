'use client'

import { getUserInfo } from '@/actions/user'
import NavItem from '@/components/NavItem'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from 'antd'
import { House, LogOut, UserRoundPen } from 'lucide-react'
import { redirect } from 'next/navigation'
import { PropsWithChildren } from 'react'

export default function HomeLayout({ children }: PropsWithChildren) {
  const navs = [
    { title: 'Home', path: '/', icon: <House className="w-5" />, matches: ['/', '/pwd/add', '/pwd/:id'] },
    { title: 'Profile', path: '/profile', icon: <UserRoundPen className="w-5" />, matches: ['/profile'] }
  ]

  const {
    data: user,
    isFetched,
    isError
  } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => getUserInfo()
  })

  if (!isFetched) {
    return <p className="mt-12 text-center">Loading...</p>
  }

  if (isError) {
    redirect('/login')
  }

  return (
    <>
      <section className="flex h-screen gap-4 overflow-y-auto p-4">
        <aside className="flex w-48 shrink-0 flex-col rounded-3xl border border-gray-200 bg-gray-50 p-4">
          <h1 className="text-primary text-center text-4xl font-bold italic">orzpass</h1>

          <div className="mt-12 mb-4 flex flex-col items-center justify-center gap-2">
            <Avatar size={80}>{user?.nickname?.slice(0, 1)}</Avatar>
            <p className="text-center">
              <span>{user?.nickname}</span>
            </p>
          </div>

          <nav className="my-4">
            <ul className="flex flex-col gap-4">
              {navs.map((item) => (
                <NavItem key={item.path} label={item.title} href={item.path} icon={item.icon} matches={item.matches} />
              ))}
            </ul>
          </nav>

          <nav className="mt-auto">
            <ul className="flex flex-col gap-4">
              <NavItem key="logout" label="Logout" href="/login" icon={<LogOut className="w-5" />} />
            </ul>
          </nav>
        </aside>

        <main className="scrollbar-none flex-1 overflow-y-auto rounded-3xl border border-gray-200 p-8">{children}</main>
      </section>
    </>
  )
}
