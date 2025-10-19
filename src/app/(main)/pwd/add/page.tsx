'use client'

import PasswordForm from '@/components/PasswordForm'
import { Breadcrumb } from 'antd'

export default function AddPassword() {
  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Passwords' }, { title: 'Add' }]} />

      <div className="mx-auto mt-4 w-xl">
        <PasswordForm />
      </div>
    </>
  )
}
