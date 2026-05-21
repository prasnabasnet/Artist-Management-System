"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { tokenService } from "@/lib/token";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  LayoutDashboard,
  Music,
  LogOut,
  MicVocal,
  Search,
  Menu,
  X,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [userName, setUserName] = useState("Admin");
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = tokenService.getAccessToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        if (decoded.role === "artist") {
          window.location.href = "/login";
          return;
        }

        setRole(decoded.role);
        setChecking(false);

        const email: string = decoded.email;
        if (email) {
          const name = email.split("@")[0];
          setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        }
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    tokenService.clearToken();
    router.push("/login");
  };

  const allNavItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["super_admin", "artist_manager"],
    },
    {
      name: "Artists",
      href: "/dashboard/artists",
      icon: MicVocal,
      roles: ["super_admin", "artist_manager"],
    },
    {
      name: "Musics",
      href: "/dashboard/music",
      icon: Music,
      roles: ["super_admin", "artist_manager"],
    },
  ];

  const navItems = allNavItems.filter(
    (item) => role && item.roles.includes(role)
  );

  if (checking || !role) return null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full w-64 bg-white border-r shadow-sm
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-6">
          <div className="text-2xl font-bold text-indigo-600">AMS Admin</div>
          <button className="md:hidden" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm md:text-base ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {role.replace("_", " ")}
          </span>
        </div>

        <div className="p-4 border-t mt-5">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col w-full">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="relative w-full sm:w-64 md:w-80 lg:w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search users, artists..."
                className="pl-10 bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-4">
            <Avatar>
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:block font-medium text-gray-700">
              {userName}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}