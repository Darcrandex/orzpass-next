'use client'

import { resetPassword, sendResetPasswordEmail } from '@/actions/auth'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPassword() {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()
  const [countdown] = useState(0)

  const sendCodeMutation = useMutation({
    mutationFn: async (email: string) => {
      await sendResetPasswordEmail(email)
    },
    onSuccess: () => {
      message.success('Verification code sent, please check your email')
    },
    onError: (error) => {
      message.error(`Failed to send verification code: ${error.message}`)
    }
  })

  const resetMutation = useMutation({
    mutationFn: async (values: { email: string; code: string; password: string }) => {
      await resetPassword(values.code, values.password)
    },
    onSuccess: () => {
      message.success('Password reset successful')
      router.push('/login')
    }
  })

  const handleSendCode = () => {
    form.validateFields(['email']).then((values) => {
      sendCodeMutation.mutate(values.email)
    })
  }

  const handleSubmit = (values: { email: string; code: string; password: string; confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      message.error('The passwords do not match')
      return
    }

    resetMutation.mutate(values)
  }

  return (
    <section className="from-primary flex h-screen items-center justify-center bg-linear-180 to-white">
      <div className="w-xl bg-white p-8 shadow-xl">
        <h1 className="text-primary mb-8 text-center text-3xl font-bold italic">Reset Password</h1>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input placeholder="Enter your email" maxLength={50} />
          </Form.Item>

          <Form.Item label="Verification Code" required>
            <div className="flex gap-2">
              <Form.Item name="code" noStyle rules={[{ required: true, message: 'Please enter verification code' }]}>
                <Input placeholder="Enter verification code" maxLength={10} />
              </Form.Item>
              <Button onClick={handleSendCode} loading={sendCodeMutation.isPending} disabled={countdown > 0}>
                {countdown > 0 ? `Retry in ${countdown}s` : 'Get Code'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password placeholder="Enter new password" maxLength={30} />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('The passwords do not match'))
                }
              })
            ]}
          >
            <Input.Password placeholder="Confirm your password" maxLength={30} />
          </Form.Item>

          <div className="mt-8 flex flex-col gap-4">
            <Button type="primary" htmlType="submit" loading={resetMutation.isPending} block>
              Reset Password
            </Button>
            <Button href="/login" type="link" block>
              Back to Login
            </Button>
          </div>
        </Form>
      </div>
    </section>
  )
}
