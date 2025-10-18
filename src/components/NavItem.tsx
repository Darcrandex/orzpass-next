'use client'

import { cls } from '@/utils/cls'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavItemProps = { label: string; href: string; icon?: React.ReactNode; matches?: string[] }

export default function NavItem({ label, href, icon, matches = [] }: NavItemProps) {
  const pathname = usePathname()
  const isActive = matches.some((m) => pathname === m)

  return (
    <li>
      <Link
        href={href}
        className={cls(
          'flex items-center gap-2 rounded-md p-2 text-lg !transition-colors',
          isActive ? '!text-primary !bg-primary/5' : 'hover:!bg-primary/5 !text-gray-500'
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  )
}
