'use client'

import { loginUser } from '@/actions/user'
import FullPageContainer from '@/components/FullPageContainer'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const submit = useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      await loginUser(values.email, values.password)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/')
    },

    onError(error) {
      message.error(error.message)
    }
  })

  return (
    <FullPageContainer>
      <div className="w-xl bg-white p-8 shadow-xl">
        <h1 className="ui-font-nordminne-script text-primary mb-8 text-center text-5xl font-bold">
          Welcome To Orzpass
        </h1>

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

          <p className="text-primary my-4 text-right text-sm">
            <Link href="/forgot-password" className="text-blue-600 underline">
              Forgot password?
            </Link>
          </p>

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
    </FullPageContainer>
  )
}
