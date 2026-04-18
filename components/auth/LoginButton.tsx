"use client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { LogIn } from "lucide-react";

export function LoginButton() {
  const { login } = useAuth();
  return (
    <Button
      label="Sign in with Quran Foundation"
      onClick={login}
      variant="primary"
      size="lg"
      icon={<LogIn className="w-4 h-4" />}
    />
  );
}
