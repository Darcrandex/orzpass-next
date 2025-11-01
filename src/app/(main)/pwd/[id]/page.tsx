'use client'

import PasswordForm from '@/components/PasswordForm'
import PasswordRemove from '@/components/PasswordRemove'
import { useIsFetching } from '@tanstack/react-query'
import { Breadcrumb, Spin } from 'antd'
import { useParams } from 'next/navigation'

export default function PwdDetail() {
  const { id } = useParams<{ id: string }>()
  const isLoading = useIsFetching() > 0
  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Passwords' }, { title: 'Detail' }]}></Breadcrumb>

      <div className="mx-auto mt-4 w-xl">
        <Spin spinning={isLoading}>
          <PasswordForm id={id} />
          <PasswordRemove id={id} className="mt-20" />
        </Spin>
      </div>
    </>
  )
}
