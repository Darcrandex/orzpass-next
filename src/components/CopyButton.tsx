'use client'

import { Button } from 'antd'
import copy from 'copy-to-clipboard'
import { delay } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { useState } from 'react'

export default function CopyButton(props: { text?: string | null }) {
  const { text } = props
  const [isPending, setIsPending] = useState(false)

  const onCopy = async () => {
    setIsPending(true)
    copy(text || '')
    await delay(2000)
    setIsPending(false)
  }

  return (
    <Button onClick={onCopy} disabled={isPending || isEmpty(text)}>
      {isPending ? 'Copied' : 'Copy'}
    </Button>
  )
}
