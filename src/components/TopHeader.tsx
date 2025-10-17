'use client'

import { logoutUser } from '@/actions/auth'
import { User } from '@/db/schema/users'
import { Dropdown } from 'antd'

export default function TopHeader(props: { user: Omit<User, 'password'> }) {
  const onLogout = async () => {
    await logoutUser()
  }

  const items = [{ label: 'Logout', key: 'logout', onClick: onLogout }]

  return (
    <header className="fixed top-0 right-0 left-0 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <h1>OrzPass</h1>

      <Dropdown menu={{ items }}>
        <span>{props.user.nicname}</span>
      </Dropdown>
    </header>
  )
}
