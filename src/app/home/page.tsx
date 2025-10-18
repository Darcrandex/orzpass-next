/**
 * 主面板首页, 也是密码管理页面
 */

import { getUserPasswords } from '@/actions/pwd'
import ItemList from '@/components/ItemList'
import { Breadcrumb } from 'antd'

export default async function Home() {
  const list = await getUserPasswords()

  return (
    <>
      <Breadcrumb items={[{ title: 'Home' }, { title: 'Passwords' }]} />

      <ItemList data={list} />
    </>
  )
}
