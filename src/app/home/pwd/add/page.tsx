import { createPassword } from '@/actions/pwd'
import PasswordForm from '@/components/PasswordForm'
import { Breadcrumb } from 'antd'
import { redirect } from 'next/navigation'

export default async function AddPassword() {
  const updateAction = async (values: any) => {
    'use server'
    await createPassword(values)
    redirect('/home')
  }

  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Passwords' }, { title: 'Add' }]} />

      <div className="mx-auto mt-4 w-xl">
        <PasswordForm action={updateAction} />
      </div>
    </>
  )
}
