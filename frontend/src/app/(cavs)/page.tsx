"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LinkButton } from '@/components/ui/linkButton'
import { ArrowRight, Vote, Plus } from 'lucide-react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const contentFadeVariants = {
    hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0)",
      transition: { ease: "easeInOut", duration: 0.8 }
    }
  }

  if (!mounted) return null;

  return (
    <section className="flex justify-start items-center flex-col text-center container min-h-[calc(100vh-120px)] pt-10 sm:pt-14 pb-12">
      {/* Pill Badge */}
      <motion.div
        key="badge"
        variants={contentFadeVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-muted/50 text-xs sm:text-sm text-muted-foreground mb-6"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>CUET Anonymous Voting System</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        key="main-title"
        variants={{...contentFadeVariants, visible: { ...contentFadeVariants.visible, transition: {...contentFadeVariants.visible.transition, delay: 0.15} }}}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/50 to-black/50 bg-clip-text py-3 text-4xl font-bold text-center leading-tight tracking-tight text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl max-w-[950px]"
      >
        Your Voice Matters.<br />
        <span className="bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">
          100% Anonymous.
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        key="description"
        variants={{...contentFadeVariants, visible: { ...contentFadeVariants.visible, transition: {...contentFadeVariants.visible.transition, delay: 0.3} }}}
        initial="hidden"
        animate="visible"
        className="mt-6 mb-10 text-base tracking-tight text-muted-foreground sm:text-lg md:text-xl text-balance max-w-[700px]"
      >
        Cast your vote securely, express your true opinion, and shape campus decisions at CUET without fear or bias.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        key="buttons"
        variants={{...contentFadeVariants, visible: { ...contentFadeVariants.visible, transition: {...contentFadeVariants.visible.transition, delay: 0.45} }}}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <LinkButton size="lg" className="flex items-center gap-2 px-6" href="/polls/all">
          <Vote size={18} />
          Explore Polls
          <ArrowRight size={16} />
        </LinkButton>
        <LinkButton size="lg" variant="outline" className="flex items-center gap-2 px-6" href="/polls/create">
          <Plus size={18} />
          Create a Poll
        </LinkButton>
      </motion.div>
    </section>
  )
}
