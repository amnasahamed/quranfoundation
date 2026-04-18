"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Mic, User } from "lucide-react";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/surahs", icon: BookOpen, label: "Surahs" },
  { href: "/practice", icon: Mic, label: "Practice" },
  { href: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-elevated z-50 safe-area-bottom">
      <div className="flex justify-around py-2 pb-6">
        {NAV.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all min-w-[60px] ${
                isActive
                  ? "text-primary"
                  : "text-text-muted hover:text-text-secondary"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-2" : ""}`} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
