interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-surface-elevated text-text-secondary",
    primary: "bg-primary/20 text-primary",
    accent: "bg-accent/20 text-accent",
    danger: "bg-danger/20 text-danger",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
