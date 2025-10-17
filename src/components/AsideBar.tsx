import { Avatar } from 'antd'
import { House, LogOut, UserRoundPen } from 'lucide-react'
import NavItem from './NavItem'

export default function AsideBar() {
  const navs = [
    { title: 'Home', path: '/home', icon: <House className="w-5" /> },
    { title: 'Profile', path: '/home/profile', icon: <UserRoundPen className="w-5" /> }
  ]

  return (
    <aside className="flex w-48 shrink-0 flex-col rounded-3xl border border-gray-200 bg-gray-50 p-4">
      <h1 className="text-primary text-center text-4xl font-bold italic">orzpass</h1>

      <div className="mt-12 mb-4 flex flex-col items-center justify-center gap-2">
        <Avatar
          size={80}
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fimg.52desk.com%2Ftp%2F233515S86MT.jpg&f=1&nofb=1&ipt=b31d163ca54ce75731e0eb2e7ccee4dd1810449ad1d6a82e172ac417fefacf9e"
        >
          Darcrand
        </Avatar>
        <p className="text-center">
          <span>Darcrand</span>
        </p>
      </div>

      <nav className="my-4">
        <ul className="flex flex-col gap-4">
          {navs.map((item) => (
            <NavItem key={item.path} label={item.title} href={item.path} icon={item.icon} />
          ))}
        </ul>
      </nav>

      <nav className="mt-auto">
        <ul className="flex flex-col gap-4">
          <NavItem key="logout" label="Logout" href="/home/login" icon={<LogOut className="w-5" />} />
        </ul>
      </nav>
    </aside>
  )
}
