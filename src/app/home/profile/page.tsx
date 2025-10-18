import { getUserInfo, updateUser, updateUserPassword } from '@/actions/auth'
import ProfileForm from '@/components/ProfileForm'
import UserPasswordForm from '@/components/UserPasswordForm'
import { User } from '@/db/schema/users'
import { Breadcrumb } from 'antd'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function Profile() {
  const user = await getUserInfo()
  const updateAction = async (values: Pick<User, 'id' | 'nickname' | 'email'>) => {
    'use server'
    await updateUser(values)
    revalidatePath('/home/profile')
  }

  const updatePassword = async (values: { oldPassword: string; newPassword: string }) => {
    'use server'
    await updateUserPassword(values)
    revalidatePath('/home/profile')
    redirect('/login')
  }

  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Profile' }]} />

      <div className="mx-auto mt-4 w-xl">
        <h2 className="mb-8 text-2xl font-bold">Base Info</h2>
        <ProfileForm data={user} action={updateAction} />

        <h2 className="mt-20 mb-8 text-2xl font-bold">Update Password</h2>
        <UserPasswordForm action={updatePassword} />
      </div>
    </>
  )
}
