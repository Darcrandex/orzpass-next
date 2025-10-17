import { getUserInfo } from '@/actions/auth'
import { redirect } from 'next/navigation'

export default async function RootPage() {
  const user = await getUserInfo()

  return redirect(user?.id ? '/home' : '/login')
}
