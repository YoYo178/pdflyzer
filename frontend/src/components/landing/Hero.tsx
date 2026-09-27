import { useRef, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import {
  IconArrowRight,
  IconCheck,
  IconLock,
  IconQuote,
  IconSparkles,
} from '@tabler/icons-react';

import { ButtonLink } from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Container from '@/components/ui/container';
import FloatingLabel from '@/components/ui/floating-label';
import Reveal from '@/components/ui/reveal';
import ChatMock from './ChatMock';

const TRUST_POINTS = [
  'No credit card required',
  'Private by default',
  'Multi-document chats',
];

const METRICS = [
  { value: '100%', label: 'of answers cite a real source' },
  { value: '<1s', label: 'to first streamed token' },
  { value: '∞', label: 'documents in a single chat' },
  { value: '24/7', label: 'your documents, on call' },
];

function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = glowRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }

  return (
    <section
      id='top'
      className='relative overflow-hidden pt-32 sm:pt-40'
      onMouseMove={onMove}
      aria-label='Intro'
    >
      {/* backdrop */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_50%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]' />
        <div className='absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-teal-500/15 blur-[140px] dark:bg-teal-400/10' />
        <div
          ref={glowRef}
          className='absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(360px_circle_at_var(--mx,50%)_var(--my,0%),rgba(20,184,166,0.10),transparent_65%)]'
        />
      </div>

      <Container>
        <div className='mx-auto max-w-3xl text-center'>

          <Reveal delay={80}>
            <h1 className='mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl'>
              Chat with your documents.
              <span className='mt-2 block bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent dark:from-teal-300 dark:via-cyan-300 dark:to-teal-300'>
                Every answer, cited.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className='mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg'>
              Upload PDFs, ask questions in plain language, and get answers back
              rooted in the exact page they came from — streamed live, proof
              included.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className='mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <ButtonLink
                to='/register'
                variant='brand'
                size='lg'
                className='group w-full sm:w-auto'
              >
                Start chatting free
                <IconArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
              </ButtonLink>
              <button
                type='button'
                onClick={() =>
                  document
                    .querySelector('#how-it-works')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className='w-full rounded-xl border border-border bg-secondary/40 px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-secondary sm:w-auto'
              >
                See how it works
              </button>
            </div>
          </Reveal>
        </div>

        {/* trust points — tight, centered group; wraps 2+1 on phone */}
        <Reveal delay={320}>
          <div className='mt-10 flex w-full flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs text-muted-foreground sm:gap-x-1.5'>
            {TRUST_POINTS.map((t) => (
              <span
                key={t}
                className='flex basis-1/2 items-center justify-center gap-1 px-2 py-1 text-center sm:basis-auto sm:px-0 sm:py-0'
              >
                <IconCheck className='h-3.5 w-3.5 shrink-0 text-teal-600 dark:text-teal-300' />
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* product mock */}
        <div className='relative mx-auto mt-16 max-w-5xl sm:mt-20'>
          <Reveal delay={200} className='relative'>
            <div className='absolute -inset-x-8 -top-10 -z-10 h-full rounded-[40px] bg-gradient-to-t from-teal-500/10 via-cyan-500/5 to-transparent blur-2xl dark:from-teal-400/10 dark:via-cyan-400/5' />
            <ChatMock />

            <motion.div
              className='pointer-events-none absolute -right-8 bottom-32 hidden xl:block'
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <FloatingLabel
                icon={IconQuote}
                title='3 sources cited'
                subtitle='every claim verifiable'
              />
            </motion.div>
            <motion.div
              className='pointer-events-none absolute -left-8 top-40 hidden xl:block'
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.2,
              }}
            >
              <FloatingLabel
                icon={IconLock}
                title='Private & scoped'
                subtitle='only your docs, only you'
              />
            </motion.div>
          </Reveal>
        </div>

        {/* metrics */}
        <Reveal delay={120}>
          <div className='mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4'>
            {METRICS.map((m) => (
              <div
                key={m.label}
                className='bg-background px-6 py-7 text-center'
              >
                <p className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                  {m.value}
                </p>
                <p className='mt-1.5 text-xs text-muted-foreground'>
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default Hero;
