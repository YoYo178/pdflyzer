import {
  IconBroadcast,
  IconFiles,
  IconLock,
  IconPdf,
  IconQuote,
  IconUserShield,
} from '@tabler/icons-react';

import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import SectionHeading from '@/components/ui/section-heading';

const FEATURES = [
  {
    icon: IconQuote,
    title: 'Cited answers',
    desc: 'Every response is tied to the exact page and section it came from. No unchecked hallucinations — tap a citation and jump straight to the source.',
  },
  {
    icon: IconFiles,
    title: 'Multi-document chats',
    desc: 'Drop contracts, specs, and reports into one chat. pdflyzer reads across all of them so your questions get full-context answers.',
  },
  {
    icon: IconBroadcast,
    title: 'Live streaming',
    desc: 'Responses arrive token by token over a persistent WebSocket. You read along as the answer forms — just like messaging a teammate.',
  },
  {
    icon: IconLock,
    title: 'Private by default',
    desc: 'Your files stay yours. Auth-gated accounts keep every chat scoped to the documents you choose to share with it.',
  },
  {
    icon: IconUserShield,
    title: 'Secure accounts',
    desc: 'Full registration and authentication baked in. Sign up, create a chat, and pick right back up from any device.',
  },
  {
    icon: IconPdf,
    title: 'PDF-native',
    desc: 'Built to parse PDFs faithfully — tables, headers, and page breaks survive, so citations always point to real content.',
  },
];

function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to trust an AI with your documents"
            description="pdflyzer is small by design: upload, ask, verify. The hard parts — grounding, streaming, and privacy — are handled for you."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 90} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-secondary/40 p-6 transition-colors duration-300 hover:border-teal-600/40 dark:hover:border-teal-300/30">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-500/0 blur-3xl transition-colors duration-500 group-hover:bg-teal-500/10 dark:bg-teal-400/0 dark:group-hover:bg-teal-300/10" />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-teal-600 dark:text-teal-300">
                    <f.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Features;