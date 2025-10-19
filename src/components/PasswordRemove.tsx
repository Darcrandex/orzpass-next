'use client'

import { removeItem } from '@/actions/items'
import { cls } from '@/utils/cls'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App, Button, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function PasswordRemove(props: { id: string; className?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { message } = App.useApp()
  const [visible, setVisible] = useState(false)

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await removeItem(id)
    },
    onSuccess: () => {
      message.success('remove success')
      queryClient.invalidateQueries({ queryKey: ['password'] })
      router.replace('/')
    }
  })

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
        onOk={async () => removeMutation.mutate(props.id)}
        onCancel={() => setVisible(false)}
        okButtonProps={{ loading: removeMutation.isPending }}
      >
        Are you sure you want to delete this password?
      </Modal>
    </>
  )
}
