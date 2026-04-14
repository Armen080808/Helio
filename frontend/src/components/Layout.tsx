import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import NavLinks from "@/components/NavLinks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";

function getInitials(name: string | undefined, email: string | undefined): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email ? email[0].toUpperCase() : "U";
}

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r bg-background px-4 py-6">
        <span className="mb-8 px-2 text-xl font-bold tracking-tight">alyo</span>
        <div className="flex-1">
          <NavLinks />
        </div>
        <Separator className="my-4" />
        {/* User info + logout */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 px-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {getInitials(user?.name, user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-xs font-medium text-foreground">
                {user?.name ?? user?.email}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-muted/30 p-8">
        <Outlet />
      </main>
    </div>
  );
}
