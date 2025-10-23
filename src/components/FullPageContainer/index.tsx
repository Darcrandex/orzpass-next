// 主要实现噪点背景的容器组件

import { PropsWithChildren } from 'react'
import './styles.css'

export default function FullPageContainer({ children }: PropsWithChildren) {
  return (
    <section className="ui-theme-gradient-bg flex h-screen items-center justify-center">
      <div className="relative z-10">{children}</div>
    </section>
  )
}
