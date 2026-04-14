import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NavLinks from "./NavLinks";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-zinc-100 bg-white px-4 py-6">
        <span className="mb-8 px-2 text-xl font-bold text-indigo-600">helio</span>
        <NavLinks />
        {/* User info + logout */}
        <div className="border-t border-zinc-100 pt-4">
          <p className="truncate px-2 text-xs font-medium text-zinc-900">
            {user?.name ?? user?.email}
          </p>
          <p className="truncate px-2 text-xs text-zinc-400">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-zinc-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
