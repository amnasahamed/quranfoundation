import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = "", onClick, hover = false }: CardProps) {
  const baseClass = `bg-surface rounded-xl border border-surface-elevated ${className}`;

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={baseClass}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return <div className={baseClass} onClick={onClick}>{children}</div>;
}
