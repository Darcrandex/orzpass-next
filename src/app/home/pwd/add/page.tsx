import { db } from "@/db";
import { passwords } from "@/db/schema/passwords";
import { users } from "@/db/schema/users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function AddPassword() {
  const userList = await db.select().from(users);

  // 定义一个服务端函数来处理表单提交
  async function createUser(formData: FormData) {
    "use server"; // 👈 声明为服务端函数

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    // 这里可以写数据库逻辑，比如使用 drizzle ORM 保存数据
    console.log("Saving user:", { name, email });

    if (userList.length === 0) {
      throw new Error("No user found");
    }

    await db.insert(passwords).values({
      uid: userList[0].id,
      title: name,
      username: email,
      password: `${name}_${email}`,
      iv: "123123",
    });

    // 可选：刷新页面数据或跳转
    revalidatePath("/home");
    redirect("/home");
  }

  return (
    <>
      <h1 className="m-4 text-center">Add Password</h1>

      <form action={createUser}>
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

        <button type="submit">提交</button>
      </form>
    </>
  );
}
