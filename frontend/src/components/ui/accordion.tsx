import { IconChevronDown } from '@tabler/icons-react';

import { cn } from '@/lib/utils';
import Reveal from './reveal';

export interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <Reveal key={item.q} delay={i * 50}>
          <details className="group rounded-2xl border border-border bg-secondary/40 transition-colors open:border-teal-600/40 open:bg-secondary/60 dark:open:border-teal-300/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-foreground [&::-webkit-details-marker]:hidden">
              {item.q}
              <IconChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-teal-600 dark:group-open:text-teal-300" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

export default Accordion;