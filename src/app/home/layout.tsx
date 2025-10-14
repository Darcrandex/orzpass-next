import Link from "next/link";
import { PropsWithChildren } from "react";

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <header>
        <h1>OrzPass</h1>
      </header>

      <aside>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main>{children}</main>
    </>
  );
}
