import { updatePassword } from "@/actions/pwd";
import PasswordForm from "@/components/PasswordForm";
import { db } from "@/db";
import { type PasswordUpdateDTO, passwords } from "@/db/schema/passwords";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function PwdDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data] = await db.select().from(passwords).where(eq(passwords.id, id));
  const updateAction = async (values: PasswordUpdateDTO) => {
    "use server";
    await updatePassword(values);
    revalidatePath(`/home/pwd/${id}`);
  };

  return (
    <>
      <h1>Password Detail</h1>
      <p>ID: {id}</p>

      <pre className="m-4 bg-amber-100">{JSON.stringify(data, null, 2)}</pre>

      <hr className="my-4 border-b border-gray-300" />
      <PasswordForm data={data} updateAction={updateAction} />
    </>
  );
}
