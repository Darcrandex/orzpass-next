'use client'

import PasswordForm from '@/components/PasswordForm'
import PasswordRemove from '@/components/PasswordRemove'
import { Breadcrumb } from 'antd'
import { useParams } from 'next/navigation'

export default function PwdDetail() {
  const { id } = useParams<{ id: string }>()
  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Passwords' }, { title: 'Detail' }]}></Breadcrumb>

      <div className="mx-auto mt-4 w-xl">
        <PasswordForm id={id} />
        <PasswordRemove id={id} className="mt-20" />
      </div>
    </>
  )
}
