"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export function Header({ title, showBack = false, rightElement }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="px-4 py-3 flex items-center justify-between border-b border-surface-elevated">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      {rightElement || <div />}
    </div>
  );
}
