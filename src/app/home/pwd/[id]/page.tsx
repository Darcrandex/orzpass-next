import { getPasswordDetail, removePassword, updatePassword } from '@/actions/pwd'
import PasswordForm from '@/components/PasswordForm'
import PasswordRemove from '@/components/PasswordRemove'
import { PasswordUpdateDTO } from '@/db/schema/passwords'
import { Breadcrumb } from 'antd'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function PwdDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getPasswordDetail(id)

  const updateAction = async (values: PasswordUpdateDTO) => {
    'use server'
    await updatePassword(values)
    revalidatePath(`/home/pwd/${id}`)
  }

  const removeAction = async () => {
    'use server'
    await removePassword(id)
    revalidatePath('/home/pwd')
    redirect('/home')
  }

  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Passwords' }, { title: 'Detail' }]}></Breadcrumb>

      <div className="mx-auto mt-4 w-xl">
        <PasswordForm data={data} action={updateAction} />

        <PasswordRemove action={removeAction} className="mt-20" />
      </div>
    </>
  )
}
