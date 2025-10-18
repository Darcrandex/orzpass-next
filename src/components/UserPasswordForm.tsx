'use client'

import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'

export default function UserPasswordForm({
  action
}: {
  action: (values: { oldPassword: string; newPassword: string }) => Promise<void>
}) {
  const [form] = Form.useForm()

  const submit = useMutation({
    mutationFn: async (values: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
      await action({ oldPassword: values.oldPassword, newPassword: values.newPassword })
    }
  })

  return (
    <Form form={form} layout="vertical" onFinish={submit.mutate} autoComplete="off">
      <Form.Item
        name="oldPassword"
        label="Old Password"
        rules={[{ required: true, message: 'Please enter your old password' }]}
      >
        <Input.Password maxLength={30} allowClear />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="New Password"
        rules={[
          { required: true, message: 'Please enter your new password' },
          { min: 6, message: 'Password length must be at least 6 characters' }
        ]}
      >
        <Input.Password maxLength={30} allowClear />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm New Password"
        rules={[
          { required: true, message: 'Please confirm your new password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('Passwords do not match'))
            }
          })
        ]}
      >
        <Input.Password maxLength={30} allowClear />
      </Form.Item>

      <div className="mt-8 flex gap-4">
        <Button type="primary" htmlType="submit" loading={submit.isPending}>
          update
        </Button>
      </div>
    </Form>
  )
}
