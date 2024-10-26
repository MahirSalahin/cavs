"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LinkButton } from '@/components/ui/linkButton'
import { ArrowRight } from 'lucide-react'
import AnimatedText from '@/components/AnimatedText'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<boolean>(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = localStorage.getItem('access_token') as string;
      setMounted(true);
      if (fetchedUser) {
        setUser(true);
        setShowContent(true);  // Immediately show content if user exists
      } else {
        // Show welcome animation if no user
        setShowWelcome(true);

        // Fade out the welcome message after 2 seconds
        const welcomeTimer = setTimeout(() => {
          setShowWelcome(false);
          setShowContent(true);  // Show main content after welcome fades out
        }, 2500); // 2.5 seconds

        return () => clearTimeout(welcomeTimer);
      }
    }

    fetchUser();
  }, [])

  const fadeVariants = {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      filter: "blur(0)",
      transition: { ease: "easeInOut", duration: 1 }
    },
    exit: {
      opacity: 0,
      filter: "blur(4px)",
      transition: { ease: "easeInOut", duration: 0.75 }
    }
  }

  const contentFadeVariants = {
    hidden: { opacity: 0, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      filter: "blur(0)",
      transition: { ease: "easeInOut", duration: 1, delay: user ? 0 : 1 }
    }
  }

  if (!mounted) return null;

  return (
    <section className="flex justify-center items-center flex-col text-center container h-full">
      <AnimatePresence mode="wait">
        {!user && showWelcome && (
          <motion.h1
            key="welcome"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gradient-to-br w-full max-w-[900px] dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-4xl font-medium text-center leading-none tracking-tighter text-transparent text-balance sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Welcome to CUET Anonymous Voting System, <span><AnimatedText text='CAVS' className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl' /></span>
          </motion.h1>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showContent && (
          <>
            <motion.h1
              key="main-title"
              variants={contentFadeVariants}
              initial="hidden"
              animate="visible"
              className="bg-gradient-to-br dark:from-white from-black from-30% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium text-center leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Have Your Say,<br /> The Anonymous Way!
            </motion.h1>

            <motion.p
              key="description"
              variants={{ ...contentFadeVariants, visible: { ...contentFadeVariants.visible, transition: { ...contentFadeVariants.visible.transition, delay: user ? .5 : 1.5 } } }}
              initial="hidden"
              animate="visible"
              className="mb-12 text-lg tracking-tight text-accent-foreground md:text-xl text-balance"
            >
              Vote without fear, without bias. Your voice, your choice, anonymously recorded.<br className="hidden md:block" />
              Join your peers at CUET and make your opinion count securely and privately.
            </motion.p>

            <motion.div
              key="button"
              variants={{ ...contentFadeVariants, visible: { ...contentFadeVariants.visible, transition: { ...contentFadeVariants.visible.transition, delay: user ? 1 : 2 } } }}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center"
            >
              <LinkButton className="flex items-center gap-1" href="/polls/all">
                Get Started <ArrowRight size={16} />
              </LinkButton>
              <p className="mt-2 text-sm text-gray-500 text-center">
                By getting started, you agree to our <a href="/terms" className="underline">Terms</a> and have read our <a href="/privacy" className="underline">Privacy Policy</a>.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
