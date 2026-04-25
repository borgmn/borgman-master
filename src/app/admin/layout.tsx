"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConvexClientProvider } from "@/components/convex-context/ConvexProvider";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/authors", label: "Authors" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ConvexClientProvider>
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Header */}
        <header className="border-b border-[#1f1f1f] bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <Link href="/admin" className="text-xl font-bold text-white">
                  Borgman Admin
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#1f1f1f] text-white"
                            : "text-[#a1a1a1] hover:text-white hover:bg-[#1f1f1f]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <Link
                href="/"
                className="text-sm text-[#a1a1a1] hover:text-white transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden border-b border-[#1f1f1f] bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#1f1f1f] text-white"
                      : "text-[#a1a1a1] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ConvexClientProvider>
  );
}
