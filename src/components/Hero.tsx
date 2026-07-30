import { motion } from 'motion/react'
import { Sparkles } from 'lucide-react'

const rise = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export function Hero({ availableCount, totalCount }: { availableCount: number; totalCount: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.08 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      <motion.span
        variants={rise}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="hub-glass inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.72rem] font-medium text-muted"
        style={{ borderColor: 'var(--hub-border)' }}
      >
        <Sparkles className="size-3" strokeWidth={2} aria-hidden />
        {availableCount} of {totalCount} tools live
      </motion.span>

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
              'linear-gradient(100deg, var(--color-conversational), var(--color-workbench) 45%, var(--color-operations))',
          }}
        >
          one place
        </span>
      </motion.h1>

      <motion.p
        variants={rise}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-lg text-[0.9rem] leading-relaxed text-muted"
      >
        A single door to every internal AI tool the department runs. Each one keeps its own
        sign-in — this just gets you there faster.
      </motion.p>
    </motion.div>
  )
}
