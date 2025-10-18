import { getUserInfo } from '@/actions/auth'
import AsideBar from '@/components/AsideBar'
import { PropsWithChildren } from 'react'

export default async function HomeLayout({ children }: PropsWithChildren) {
  const user = await getUserInfo()
  return (
    <>
      <section className="flex h-screen gap-4 overflow-y-auto p-4">
        <AsideBar user={user} />

        <main className="scrollbar-none flex-1 overflow-y-auto rounded-3xl border border-gray-200 p-8">{children}</main>
      </section>
    </>
  )
}
