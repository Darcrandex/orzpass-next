'use client'

import { resetPassword } from '@/actions/user'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
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
    <>
      <div className="mx-auto mt-4 w-xl">
        <p>sign: {sign}</p>
      </div>

      <Form onFinish={submit.mutate}>
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
          <Button type="primary" htmlType="submit" loading={submit.isPending}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
