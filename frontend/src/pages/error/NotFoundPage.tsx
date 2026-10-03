import { Link } from 'react-router';
import { motion } from 'motion/react';
import { IconFileUnknown, IconArrowLeft, IconHome } from '@tabler/icons-react';
import Container from '@/components/ui/container';
import Logo from '@/components/ui/logo';

const EASE = [0.22, 1, 0.36, 1] as const;

function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground antialiased">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_30%,#000_55%,transparent_100%)] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:56px_56px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
        <div className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-cyan-500/[0.08] blur-[120px] dark:bg-cyan-400/[0.14]" />
      </div>

      <header className="relative z-10 px-5 py-6 sm:py-8">
        <Container>
          <Logo size="md" />
        </Container>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground">
              <IconFileUnknown className="h-5 w-5" strokeWidth={1.75} />
            </span>

            <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              404 - Page not found
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              This page no longer exists, or it belongs to a different account.
              Let's get you back on track.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-6 py-3.5 text-[15px] font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <IconHome className="h-4 w-4" strokeWidth={1.75} />
                Back to home
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-[15px] font-semibold text-white shadow-sm shadow-teal-600/20 transition-all hover:bg-teal-500 dark:bg-teal-300 dark:text-zinc-950 dark:shadow-teal-300/20 dark:hover:bg-teal-200"
              >
                <IconArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                Go back
              </button>
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  );
}

export default NotFoundPage;
