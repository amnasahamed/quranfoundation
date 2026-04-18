"use client";
import { motion } from "framer-motion";
import { LoginButton } from "@/components/auth/LoginButton";
import { BookOpen, Brain, Heart, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg text-text-primary flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-4 text-primary"
        >
          HifzFlow
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-text-secondary mb-2"
        >
          Every ayah, closer to heart.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-muted mb-8 max-w-md"
        >
          A psychologically optimized Quran memorization platform. Spaced repetition, audio looping, and emotional reflection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <LoginButton />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-muted text-sm"
        >
          Powered by Quran Foundation APIs
        </motion.p>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-primary" />}
            title="Spaced Repetition"
            description="Scientifically-backed review scheduling. New ayahs repeat in 1 hour, then 1 day, 3 days, 7 days."
          />
          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-accent" />}
            title="Audio Looping"
            description="Word-by-word highlights synced to recitation audio. Loop until it clicks."
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8 text-primary" />}
            title="Emotional Reflection"
            description="After each ayah, pause and reflect. What did you feel? Connect heart and mind."
          />
        </div>
      </section>

      {/* Hackathon badge */}
      <section className="px-6 py-8 text-center border-t border-surface-elevated">
        <p className="text-text-muted text-sm">
          Built for the{" "}
          <span className="text-accent">Provision Launch × Quran Foundation Hackathon</span>
        </p>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-surface rounded-xl p-6 border border-surface-elevated"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
