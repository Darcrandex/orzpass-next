'use client'

import { User } from '@/db/schema/users'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import { isNotNil } from 'es-toolkit'
import { useEffect } from 'react'

export default function ProfileForm({
  data,
  action
}: {
  data?: Omit<User, 'password'>
  action: (values: Pick<User, 'id' | 'nickname' | 'email'>) => Promise<void>
}) {
  const { message } = App.useApp()
  const [form] = Form.useForm()

  useEffect(() => {
    if (isNotNil(data)) {
      form.setFieldsValue(data)
    }
  }, [data, form])

  const submitMutation = useMutation({
    mutationFn: async (values: Pick<User, 'id' | 'nickname' | 'email'>) => {
      await action(values)
    },
    onSuccess() {
      message.success('success')
    },
    onError(error) {
      message.error(error.message)
    }
  })

  return (
    <Form layout="vertical" form={form} onFinish={submitMutation.mutate}>
      <Form.Item name="id" hidden>
        <Input readOnly />
      </Form.Item>

      <Form.Item name="nickname" label="Nickname" rules={[{ required: true, message: 'Please input nickname' }]}>
        <Input maxLength={30} allowClear placeholder="Please input nickname" />
      </Form.Item>

      <Form.Item name="email" label="Email">
        <Input maxLength={50} allowClear placeholder="Please input email" disabled />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={submitMutation.isPending}>
        update
      </Button>
    </Form>
  )
}
