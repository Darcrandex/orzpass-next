'use client'

import { cls } from '@/utils/cls'
import { Button, Modal } from 'antd'
import { useState } from 'react'

export default function PasswordRemove(props: { action: () => Promise<void>; className?: string }) {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <div className={cls('rounded-md border border-gray-200 shadow', props.className)}>
        <header className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold text-gray-800">Delete this password</h2>
          <Button onClick={() => setVisible(true)}>DELETE</Button>
        </header>

        <hr className="my-2 border-gray-200" />

        <p className="p-4 text-sm text-gray-600">
          Once you delete a password, there is no going back. Please be certain.
        </p>
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
