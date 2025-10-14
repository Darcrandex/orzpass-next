"use client";

import { Password, PasswordUpdateDTO } from "@/db/schema/passwords";
import { useMutation } from "@tanstack/react-query";

export default function PasswordForm({
  data,
  updateAction,
}: {
  data: Password;
  updateAction: (values: PasswordUpdateDTO) => Promise<void>;
}) {
  const submitMutation = useMutation({
    mutationFn: updateAction,
  });

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const password: PasswordUpdateDTO = {
            id: data.id,
            uid: data.uid,
            title: formData.get("title") as string,
            username: formData.get("username") as string,
            password: formData.get("password") as string,
            iv: data.iv,
          };
          await submitMutation.mutateAsync(password);
        }}
      >
        <input type="text" name="title" />
        <input type="text" name="username" />
        <input type="text" name="password" />
        <button type="submit">Update</button>
      </form>
    </>
  );
}
