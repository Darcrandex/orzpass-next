import { User } from '@/db/schema/users'
import { Avatar } from 'antd'
import { House, LogOut, UserRoundPen } from 'lucide-react'
import NavItem from './NavItem'

export default function AsideBar({ user }: { user: Omit<User, 'password'> }) {
  const navs = [
    {
      title: 'Home',
      path: '/home',
      icon: <House className="w-5" />,
      matches: ['/home', '/home/pwd/add']
    },
    { title: 'Profile', path: '/home/profile', icon: <UserRoundPen className="w-5" />, matches: ['/home/profile'] }
  ]

  return (
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
  )
}
