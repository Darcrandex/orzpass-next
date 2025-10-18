import { Password } from '@/db/schema/passwords'
import Link from 'next/link'

export default function CardItem(props: { data: Omit<Password, 'password' | 'iv'> }) {
  return (
    <Link href={`/home/pwd/${props.data.id}`}>
      <div className="rounded-md border border-gray-200 p-4 shadow transition-all duration-300 ease-in-out hover:shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-gray-800">{props.data.title}</h2>
        <p className="text-sm text-gray-600">{props.data.username || 'username'}</p>
        <p className="text-sm text-gray-600">{props.data.website || 'website'}</p>
      </div>
    </Link>
  )
}
