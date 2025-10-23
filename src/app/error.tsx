'use client'
import { Button } from 'antd'
import Link from 'next/link'

// Error boundaries must be Client Components

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="bg-primary/10 flex h-screen flex-col items-center justify-center gap-4">
      <h2 className="text-primary text-9xl font-extrabold">Error</h2>
      <p className="mt-10 text-2xl text-gray-800">{error.message}</p>

      <footer className="flex justify-center gap-4">
        <Button type="link" size="large" onClick={() => reset()}>
          Try again
        </Button>

        <Link href="/">
          <Button type="link" size="large">
            Return Home
          </Button>
        </Link>
      </footer>
    </section>
  )
}
