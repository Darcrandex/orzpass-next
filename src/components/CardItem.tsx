import { Password } from '@/db/schema/passwords'
import { Avatar } from 'antd'
import Link from 'next/link'

export default function CardItem(props: { data: Omit<Password, 'password' | 'iv'> }) {
  return (
    <Link href={`/pwd/${props.data.id}`}>
      <div className="rounded-md border border-gray-200 p-4 shadow transition-all duration-300 ease-in-out hover:shadow-xl">
        <header className="mb-4 flex items-center gap-2">
          <Avatar size={40} src={props.data.icon}>
            {props.data.title?.slice(0, 1)}
          </Avatar>
          <h2 className="text-lg font-bold text-gray-800">{props.data.title}</h2>
        </header>

        <p className="text-sm text-gray-600">{props.data.username || 'username'}</p>
        <p className="text-sm text-gray-600">{props.data.website || 'website'}</p>
      </div>
    </Link>
  )
}
