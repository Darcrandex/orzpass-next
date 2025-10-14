'use client'

import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import '@ant-design/v5-patch-for-react-19'
import { App as AntdApp, ConfigProvider } from 'antd'
import type { PropsWithChildren } from 'react'

export default function AntdProvider(props: PropsWithChildren) {
  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 2
          }
        }}
      >
        <AntdApp>
          <AntdRegistry>{props.children}</AntdRegistry>
        </AntdApp>
      </ConfigProvider>
    </StyleProvider>
  )
}
