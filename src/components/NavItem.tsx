'use client'

import { cls } from '@/utils/cls'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export type NavItemProps = { label: string; href: string; icon?: React.ReactNode; matches?: string[] }

export default function NavItem({ label, href, icon, matches = [] }: NavItemProps) {
  const pathname = usePathname()
  const isActive = useMemo(() => {
    // 直接匹配完整路径
    if (pathname === href) return true

    // 检查是否匹配自定义匹配规则
    if (matches.some((match) => pathname === match)) return true

    // 处理带参数的路径模式，如 '/a/b/:id'
    for (const match of matches) {
      // 将路径模式转换为正则表达式
      const pattern = match
        .split('/')
        .map((segment) => {
          // 如果是参数部分（以:开头），则匹配任意非/字符
          if (segment.startsWith(':')) {
            return '([^/]+)'
          }
          return segment
        })
        .join('\\/')

      // 创建正则表达式并测试当前路径
      const regex = new RegExp(`^${pattern}$`)
      if (regex.test(pathname)) return true
    }
  }, [matches, pathname, href])

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
