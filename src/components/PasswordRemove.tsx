'use client'

import { cls } from '@/utils/cls'
import { Button, Card, Modal } from 'antd'
import { useState } from 'react'

export default function PasswordRemove(props: { action: () => Promise<void>; className?: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <div className={cls(props.className)}>
        <Card
          title="Delete this password"
          variant="borderless"
          extra={<Button onClick={() => setVisible(true)}>DELETE</Button>}
        >
          Once you delete a password, there is no going back. Please be certain.
        </Card>
      </div>

      <Modal
        title="Delete this password"
        open={visible}
        okText="DELETE"
        okType="danger"
        onOk={async () => props.action()}
        onCancel={() => setVisible(false)}
      >
        Are you sure you want to delete this password?
      </Modal>
    </>
  )
}
