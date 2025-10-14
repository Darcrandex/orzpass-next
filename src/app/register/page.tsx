import { db } from '@/db'
import { users } from '@/db/schema/users'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default function Register() {
  const handleSubmit = async (formData: FormData) => {
    'use server' // 👈 声明为服务端函数

    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    await db.insert(users).values({
      nicname: name as string,
      email: email as string,
      password: password as string
    })

    // 可选：刷新页面数据或跳转
    revalidatePath('/home')
    redirect('/home')
  }

  return (
    <>
      <h1 className="m-4 text-center">Register</h1>

      <form className="m-4" action={handleSubmit}>
        <div>
          <label>
            Name:
            <input type="text" name="name" required />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input type="password" name="password" required />
          </label>
        </div>

        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    </>
  )
}
