'use client'

import { sendResetPasswordEmail } from '@/actions/user'
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
    <section className="from-primary flex h-screen items-center justify-center bg-linear-180 to-white">
      <div className="w-xl bg-white p-4 shadow-xl">
        <h1 className="text-primary mb-8 text-center text-3xl font-bold italic">Forgot Password</h1>

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
    </section>
  )
}
