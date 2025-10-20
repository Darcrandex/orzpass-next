'use client'

import { sendResetPasswordEmail } from '@/actions/user'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'

export default function ForgotPassword() {
  const { message } = App.useApp()
  const submitMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      await sendResetPasswordEmail(email)
    },
    onSuccess: () => {
      message.success('Reset password email sent successfully')
    },
    onError: (error) => {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Send reset password email failed')
      }
    }
  })

  return (
    <>
      <div className="w-xl bg-white p-4 shadow-xl">
        <Form onFinish={submitMutation.mutate}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitMutation.isPending}>
              Send Reset Email
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}
