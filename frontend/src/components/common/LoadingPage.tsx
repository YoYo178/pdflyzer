import { motion } from 'motion/react';
import Logo from '@/components/ui/logo';
import LoadingSpinner from './LoadingSpinner';

const EASE = [0.22, 1, 0.36, 1] as const;

function LoadingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background text-foreground antialiased">
      {/* subtle backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_30%,#000_55%,transparent_100%)] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:56px_56px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/[0.08] blur-[120px] dark:bg-teal-400/[0.14]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <Logo size="md" />
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  );
}

export default LoadingPage;
