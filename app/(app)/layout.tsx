import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { NavLinks } from "@/app/ui/nav-links";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-zinc-100 bg-white px-4 py-6">
        <span className="mb-8 px-2 text-xl font-bold text-indigo-600">helio</span>
        <NavLinks />
        {/* User */}
        <div className="border-t border-zinc-100 pt-4">
          <p className="truncate px-2 text-xs font-medium text-zinc-900">
            {session.user.name ?? session.user.email}
          </p>
          <p className="truncate px-2 text-xs text-zinc-400">{session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-2"
          >
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>
      {/* Main */}
      <main className="flex-1 bg-zinc-50 p-8">{children}</main>
    </div>
  );
}
