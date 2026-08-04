import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function Header() {
  const session = await auth();
  const dashboard = session?.user.role === "NGO" ? "/ngo" : "/dashboard";

  return <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
      <Link href="/" className="text-xl font-bold tracking-tight text-blue-950">Clear<span className="text-emerald-600">Fund</span></Link>
      <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
        <Link href="/">Ledger</Link>
        {session ? <><Link href={dashboard}>Dashboard</Link><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="rounded-lg border border-slate-300 px-3 py-1.5">Sign out</button></form></> : <><Link href="/signin">Sign in</Link><Link className="rounded-lg bg-blue-900 px-3 py-1.5 text-white" href="/register">Join ClearFund</Link></>}
      </div>
    </nav>
  </header>;
}
