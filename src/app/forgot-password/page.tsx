'use client'

import { sendResetPasswordEmail } from '@/actions/user'
import FullPageContainer from '@/components/FullPageContainer'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import Link from 'next/link'

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
    <FullPageContainer>
      <div className="w-xl bg-white p-8 shadow-xl">
        <h1 className="ui-font-nordminne-script text-primary mb-8 text-center text-5xl font-bold">Forgot Password</h1>

        <Form layout="vertical" onFinish={submitMutation.mutate}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" block htmlType="submit" loading={submitMutation.isPending}>
              Send
            </Button>
          </Form.Item>
        </Form>

        <footer className="my-4 text-center">
          <p>
            <Link href="/login" className="mx-2 text-blue-600 underline">
              back to login
            </Link>
          </p>
        </footer>
      </div>
    </FullPageContainer>
  )
}
