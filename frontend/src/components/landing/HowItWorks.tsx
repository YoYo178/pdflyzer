import { IconBolt, IconUpload, IconUserPlus } from '@tabler/icons-react';

import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import SectionHeading from '@/components/ui/section-heading';

const STEPS = [
  {
    icon: IconUserPlus,
    step: '01',
    title: 'Create your account',
    desc: 'Register in seconds. Your chats and documents follow you on every device you sign in from.',
  },
  {
    icon: IconUpload,
    step: '02',
    title: 'Upload your documents',
    desc: 'Add one PDF or many to a single chat. pdflyzer indexes them instantly, ready to answer.',
  },
  {
    icon: IconBolt,
    step: '03',
    title: 'Ask & stream answers',
    desc: 'Type a question in plain language and watch the reply stream in live — with citations to every page it used.',
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="From PDF to cited answer in three steps"
            align="center"
          />
        </Reveal>

        <div className="relative mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
          <div className="pointer-events-none absolute left-[16.6%] right-[16.6%] top-8 hidden border-t border-dashed border-border lg:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.step} delay={i * 120}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal-600/25 bg-card text-teal-600 shadow-[0_0_0_6px_var(--background)] dark:border-teal-300/25 dark:text-teal-300">
                  <s.icon className="h-7 w-7" strokeWidth={1.6} />
                </div>
                <span className="mt-5 text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-600/80 dark:text-teal-300/80">
                  Step {s.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default HowItWorks;