"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

const EMOTIONS = [
  { id: "peace", label: "Peace", color: "text-primary", bg: "bg-primary/10" },
  { id: "hope", label: "Hope", color: "text-accent", bg: "bg-accent/10" },
  { id: "fear", label: "Fear", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "motivation", label: "Motivation", color: "text-purple-400", bg: "bg-purple-400/10" },
];

interface EmotionModalProps {
  open: boolean;
  chapterName?: string;
  ayahNumber?: number;
  onSelect: (emotion: string) => void;
  onSkip: () => void;
}

export function EmotionModal({ open, chapterName, ayahNumber, onSelect, onSkip }: EmotionModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onSkip}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-6 z-50 max-w-lg mx-auto"
          >
            <div className="w-12 h-1 bg-text-muted rounded-full mx-auto mb-6" />

            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-1">MashaAllah!</h2>
              <p className="text-text-secondary">
                You memorized {chapterName || "this ayah"}
                {ayahNumber ? ` ${ayahNumber}` : ""}
              </p>
            </div>

            <p className="text-center text-text-muted mb-4">What did you feel?</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {EMOTIONS.map((e) => (
                <motion.button
                  key={e.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(e.id)}
                  className={`${e.bg} rounded-xl p-4 text-left hover:brightness-110 transition-all`}
                >
                  <div className="flex items-center gap-2">
                    <Heart className={`w-5 h-5 ${e.color}`} />
                    <span className="font-medium">{e.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <button
              onClick={onSkip}
              className="w-full text-center text-text-muted py-2 hover:text-text-secondary transition-colors"
            >
              Skip →
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
