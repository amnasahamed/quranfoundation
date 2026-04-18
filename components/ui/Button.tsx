"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function Button({
  label,
  onClick,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon,
  children,
}: ButtonProps) {
  const variants = {
    primary: "bg-primary text-bg hover:brightness-110",
    secondary: "border border-primary text-primary hover:bg-primary/10",
    ghost: "text-text-secondary hover:text-text-primary",
    danger: "bg-danger text-white hover:brightness-110",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="w-4 h-4">{icon}</span>}
          {children}
          {label && !children && <span>{label}</span>}
        </>
      )}
    </motion.button>
  );
}
