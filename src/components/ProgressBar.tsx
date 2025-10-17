'use client'
import { ProgressProvider } from '@bprogress/next/app'
import { PropsWithChildren } from 'react'

export default function ProgressBar(props: PropsWithChildren) {
  return (
    <ProgressProvider height="4px" color="var(--color-primary)" options={{ showSpinner: false }} shallowRouting>
      {props.children}
    </ProgressProvider>
  )
}
