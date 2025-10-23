import { Button } from 'antd'
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="bg-primary/10 flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-primary text-9xl font-extrabold">404</h2>
      <p className="mt-10 text-2xl text-gray-800">Could not find requested resource</p>
      <Link href="/">
        <Button type="link" size="large">
          Return Home
        </Button>
      </Link>
    </section>
  )
}
