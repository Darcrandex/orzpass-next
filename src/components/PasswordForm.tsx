'use client'

import { createItem, getItemById, updateItem } from '@/actions/items'
import type { PasswordUpdateDTO } from '@/db/schema/passwords'
import { generatePassword } from '@/utils/gen-password'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Button, Flex, Form, Input } from 'antd'
import { isNil, isNotNil } from 'es-toolkit'
import { isEmpty } from 'es-toolkit/compat'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import CopyButton from './CopyButton'

const getHostname = (website?: string | null) => {
  if (isNil(website) || isEmpty(website)) return ''

  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`)
    return url.hostname
  } catch (error) {
    console.log('error', error)
    return ''
  }
}

export default function PasswordForm(props: { id?: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { message } = App.useApp()
  const [form] = Form.useForm()
  const isEdit = isNotNil(props?.id)

  const username = Form.useWatch('username', form)
  const password = Form.useWatch('password', form)

  const website = Form.useWatch('website', form)
  const websiteUrl = useMemo(() => {
    return getHostname(website)
  }, [website])

  const { data } = useQuery({
    enabled: isEdit,
    queryKey: ['password', props.id],
    queryFn: async () => {
      return getItemById(props.id!)
    }
  })

  useEffect(() => {
    if (isNotNil(data)) {
      form.setFieldsValue(data)
    }
  }, [data, form])

  const onGeneratePassword = () => {
    const password = generatePassword()
    form.setFieldValue('password', password)
  }

  const submitMutation = useMutation({
    mutationFn: async (values: PasswordUpdateDTO) => {
      const { website, ...rest } = values
      const data = { ...rest, website: getHostname(website) }

      let id = props.id
      if (isEdit) {
        await updateItem(data)
      } else {
        const createdId = await createItem(data)
        id = createdId
      }

      return { isEdit, id }
    },
    onSuccess({ isEdit }) {
      queryClient.invalidateQueries({ queryKey: ['password'] })
      if (isEdit) {
        message.success('update success')
      } else {
        message.success('add success')
        router.push('/')
      }
    }
  })

  return (
    <Form layout="vertical" form={form} onFinish={submitMutation.mutate}>
      <Form.Item name="id" hidden>
        <Input readOnly />
      </Form.Item>

      <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input title' }]}>
        <Input maxLength={30} allowClear />
      </Form.Item>

      <Form.Item label="Username">
        <Flex align="start" gap={8}>
          <Form.Item name="username" className="flex-1">
            <Input maxLength={30} allowClear />
          </Form.Item>
          <CopyButton text={username} />
        </Flex>
      </Form.Item>

      <Form.Item label="Password">
        <Flex align="start" gap={8}>
          <Form.Item name="password" className="flex-1">
            <Input.Password maxLength={30} allowClear />
          </Form.Item>
          <Button onClick={onGeneratePassword}>Generate</Button>
          <CopyButton text={password} />
        </Flex>
      </Form.Item>

      <Form.Item label="Website">
        <Flex align="start" gap={8}>
          <Form.Item name="website" className="flex-1">
            <Input maxLength={50} allowClear />
          </Form.Item>
          <Button disabled={!websiteUrl} href={`https://${websiteUrl}`} target="_blank">
            open
          </Button>
        </Flex>
      </Form.Item>

      <Form.Item name="remark" label="Remark">
        <Input.TextArea rows={4} showCount maxLength={500} allowClear />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={submitMutation.isPending}>
        {isEdit ? 'Update' : 'Submit'}
      </Button>
    </Form>
  )
}
