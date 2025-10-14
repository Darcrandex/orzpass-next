import { db } from "@/db";
import { redirect } from "next/navigation";

export default async function RootPage() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("db:", db);

  return redirect("/home");
}
