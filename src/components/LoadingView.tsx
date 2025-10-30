'use client'

import { cls } from '@/utils/cls'
import { PropsWithChildren } from 'react'

export default function LoadingView(props: PropsWithChildren<{ className?: string }>) {
  return <div className={cls('py-6 text-center text-gray-500', props.className)}>{props.children || 'Loading...'}</div>
}
