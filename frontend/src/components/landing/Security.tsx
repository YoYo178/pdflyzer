import { IconFingerprint, IconKey, IconReportSearch, IconShieldLock, IconUserShield } from '@tabler/icons-react';

import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import SectionHeading from '@/components/ui/section-heading';

const SECURITY_POINTS = [
  {
    icon: IconUserShield,
    title: 'Registration & auth',
    desc: 'Every user has an account. Sessions are protected and your chats are scoped to you.',
  },
  {
    icon: IconKey,
    title: 'Scoped access',
    desc: 'A chat can only ever read the documents you attach to it — nothing more.',
  },
  {
    icon: IconReportSearch,
    title: 'Nothing invented',
    desc: 'Answers are grounded in your own files, with inline references you can verify.',
  },
  {
    icon: IconFingerprint,
    title: 'No silent training',
    desc: 'Your uploads answer your questions. They are never used to train models.',
  },
];

function Security() {
  return (
    <section id="security" className="py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-secondary/50 to-transparent p-8 sm:p-14">
          <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px] dark:bg-cyan-400/10" />
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                eyebrow="Security"
                title="Your documents are the whole point. We treat them that way."
                description="A chat-with-PDF product is only useful if it is trusted with the files you would not post anywhere. pdflyzer is built around scoped access, authenticated accounts, and answers you can verify — not guess."
              />
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-teal-600/20 bg-teal-500/[0.06] p-4 dark:border-teal-300/20 dark:bg-teal-300/[0.06]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 dark:bg-teal-300/15 dark:text-teal-300">
                  <IconShieldLock className="h-5 w-5" />
                </div>
                <p className="text-sm text-foreground/90">
                  Every answer is grounded in your own files — citations are not a convenience, they
                  are the contract.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {SECURITY_POINTS.map((s, i) => (
                <Reveal key={s.title} delay={i * 80} className="h-full">
                  <div className="h-full rounded-2xl border border-border bg-background/70 p-5">
                    <s.icon className="h-5 w-5 text-teal-600 dark:text-teal-300" />
                    <h3 className="mt-3 text-sm font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Security;