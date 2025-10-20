'use client'

import { resetPassword } from '@/actions/user'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const searchParams = useSearchParams()
  const sign = searchParams.get('sign')
  const router = useRouter()
  const { message } = App.useApp()

  const submit = useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      if (!sign) {
        throw new Error('Sign is required')
      }
      await resetPassword(sign, newPassword)
    },

    onSuccess() {
      router.push('/login')
    },
    onError(error) {
      message.error(error.message)
    }
  })

  return (
    <section className="from-primary flex h-screen items-center justify-center bg-linear-180 to-white">
      <div className="w-xl bg-white p-4 shadow-xl">
        <h1 className="text-primary mb-8 text-center text-3xl font-bold italic">Reset Password</h1>

        <Form layout="vertical" onFinish={submit.mutate}>
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

          <Form.Item>
            <Button type="primary" block htmlType="submit" loading={submit.isPending}>
              Reset
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
