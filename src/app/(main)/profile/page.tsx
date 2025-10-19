'use client'

import { getUserInfo, updateUser, updateUserPassword } from '@/actions/user'
import ProfileForm from '@/components/ProfileForm'
import UserPasswordForm from '@/components/UserPasswordForm'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb } from 'antd'
import { isNil } from 'es-toolkit'

export default function Profile() {
  const { data: user, isFetched } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => getUserInfo()
  })

  if (!isFetched || isNil(user)) {
    return <p className="mt-12 text-center">Loading...</p>
  }

  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Profile' }]} />

      <div className="mx-auto mt-4 w-xl">
        <h2 className="mb-8 text-2xl font-bold">Base Info</h2>
        <ProfileForm data={user} action={updateUser} />

        <h2 className="mt-20 mb-8 text-2xl font-bold">Update Password</h2>
        <UserPasswordForm action={updateUserPassword} />
      </div>
    </>
  )
}
