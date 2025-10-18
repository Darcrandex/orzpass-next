'use client'

import { loginUser } from '@/actions/auth'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()

  const submit = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      await loginUser(values.email, values.password)
    },

    onSuccess: () => {
      router.push('/')
    },

    onError(error) {
      message.error(error.message)
    }
  })

  return (
    <section className="from-primary flex h-screen items-center justify-center bg-linear-180 to-white">
      <div className="w-xl bg-white p-4 shadow-xl">
        <h1 className="text-primary mb-8 text-center text-3xl font-bold italic">welcome to orzpass</h1>

        <Form form={form} onFinish={submit.mutate} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input maxLength={30} placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password maxLength={30} placeholder="Enter your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={submit.isPending}>
            Login
          </Button>
        </Form>

        <footer className="my-4 text-center">
          <p>
            Don&apos;t have an account yet?
            <Link href="/register" className="mx-2 text-blue-600 underline">
              Register
            </Link>
          </p>
        </footer>
      </div>
    </section>
  )
}
