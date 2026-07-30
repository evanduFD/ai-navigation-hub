import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Hero({
  availableCount,
  totalCount,
}: {
  availableCount: number
  totalCount: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.08 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <motion.img
        variants={rise}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        src="/frontier-logo.png"
        alt="Frontier Dental"
        // The charcoal half of the wordmark vanishes on the dark canvas, so it is
        // flattened to a solid white mark there; light theme keeps brand colour.
        className="h-9 w-auto sm:h-11 dark:brightness-0 dark:invert"
      />

      <motion.h1
        variants={rise}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl"
      >
        Everything our AI team built,{' '}
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage:
              'linear-gradient(100deg, oklch(0.68 0.12 220), var(--color-brand) 45%, oklch(0.87 0.14 172))',
          }}
        >
          one place
        </span>
      </motion.h1>

      <motion.span
        variants={rise}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hub-glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.72rem] font-medium text-muted"
      >
        <Sparkles className="size-3" strokeWidth={2} aria-hidden />
        {availableCount} of {totalCount} tools live
      </motion.span>
    </motion.div>
  )
}
