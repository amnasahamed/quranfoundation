"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  persistent?: boolean;
}

export function Modal({ open, onClose, children, persistent = false }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {!persistent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={onClose}
            />
          )}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-6 z-50 max-w-lg mx-auto"
          >
            <div className="w-12 h-1 bg-text-muted rounded-full mx-auto mb-6" />
            {!persistent && (
              <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            )}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
