import Accordion, { type AccordionItem } from '@/components/ui/accordion';
import Container from '@/components/ui/container';
import Reveal from '@/components/ui/reveal';
import SectionHeading from '@/components/ui/section-heading';

const FAQ_ITEMS: AccordionItem[] = [
  {
    q: 'What file types can I upload?',
    a: 'PDFs today — that is what pdflyzer is built around. More document formats will follow as the product grows.',
  },
  {
    q: 'Can I ask questions across several documents at once?',
    a: 'Yes. Upload as many PDFs as you need to a single chat. pdflyzer searches all of them together so answers blend context across files.',
  },
  {
    q: 'How do citations work?',
    a: 'Each answer is generated from the documents in your chat, and every source claim carries a reference — the file name, page, and section. Open it to verify in one click.',
  },
  {
    q: 'Why does streaming matter?',
    a: 'Instead of waiting for a static block of text, answers arrive live over a WebSocket the moment the first tokens are ready. It feels like a conversation, not a batch job.',
  },
  {
    q: 'Is it free to start?',
    a: 'Yes. Create an account and start chatting right away — no credit card required.',
  },
  {
    q: 'Is my data private?',
    a: 'Your documents are scoped to your account and used only to answer your questions. We do not train on your uploads.',
  },
];

function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <Container className="max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Questions, answered" align="center" />
        </Reveal>

        <Reveal delay={100}>
          <Accordion items={FAQ_ITEMS} className="mt-12" />
        </Reveal>
      </Container>
    </section>
  );
}

export default FAQ;