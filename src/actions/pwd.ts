"use server";

import { db } from "@/db";
import { passwords, PasswordUpdateDTO } from "@/db/schema/passwords";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";

export async function createPassword(formData: FormData) {
  const userList = await db.select().from(users);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

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
}

export async function updatePassword(params: PasswordUpdateDTO) {
  await db.update(passwords).set(params).where(eq(passwords.id, params.id));
}

export async function removePassword(id: string) {
  await db.delete(passwords).where(eq(passwords.id, id));
}
