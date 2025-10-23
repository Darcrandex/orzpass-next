'use client'

import { registerUser } from '@/actions/user'
import FullPageContainer from '@/components/FullPageContainer'
import { UserInsertDTO } from '@/db/schema/users'
import { useMutation } from '@tanstack/react-query'
import { App, Button, Form, Input } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()

  const submit = useMutation({
    mutationFn: async (values: UserInsertDTO) => {
      const { nickname } = values
      await registerUser({ ...values, nickname: nickname || `user ${Date.now()}` })
    },

    onSuccess: () => {
      router.push('/login')
    },

    onError(error) {
      message.error(error.message)
    }
  })

  return (
    <FullPageContainer>
      <div className="w-xl bg-white p-8 shadow-xl">
        <h1 className="ui-font-nordminne-script text-primary mb-8 text-center text-5xl font-bold">
          Register To Orzpass
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

          <Form.Item name="nickname" label="Nickname">
            <Input maxLength={30} placeholder="Enter your nickname" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={submit.isPending}>
            Register
          </Button>
        </Form>

        <footer className="my-4 text-center">
          <p>
            Already have an account?
            <Link href="/login" className="mx-2 text-blue-600 underline">
              Login
            </Link>
          </p>
        </footer>
      </div>
    </FullPageContainer>
  )
}
