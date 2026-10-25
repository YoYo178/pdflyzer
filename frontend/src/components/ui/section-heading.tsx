import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  id?: string;
  className?: string;
}

function Eyebrow({ text, centered }: { text: string; centered: boolean }) {
  return (
    <p
      className={cn(
        'mb-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-teal-600 dark:text-teal-300',
        centered && 'justify-center',
      )}
    >
      {!centered && <span className="h-px w-6 bg-teal-600/60 dark:bg-teal-300/60" />}
      {text}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  id,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div className={cn(centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      {eyebrow && <Eyebrow text={eyebrow} centered={centered} />}
      <h2
        id={id}
        className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export default SectionHeading;