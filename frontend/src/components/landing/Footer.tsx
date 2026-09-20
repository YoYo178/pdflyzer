import {
  IconArrowUp,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandX,
} from '@tabler/icons-react';

import Container from '@/components/ui/container';
import Logo from '@/components/ui/logo';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com', icon: IconBrandGithub },
  { label: 'X (formerly Twitter)', href: 'https://x.com', icon: IconBrandX },
  { label: 'GitLab', href: 'https://gitlab.com', icon: IconBrandGitlab },
];

function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="py-4">
        {/* desktop: logo + back to top on one row */}
        <div className="hidden items-center justify-between md:flex">
          <a href="#top" aria-label="pdflyzer home">
            <Logo size="sm" />
          </a>

          <a
            href="#top"
            className="inline-flex items-center gap-1 rounded-md py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top
            <IconArrowUp className="h-3 w-3" />
          </a>
        </div>

        {/* phone: branding left, tagline right */}
        <div className="flex flex-col gap-4 md:hidden">
          <div className="grid grid-cols-2 items-center gap-6">
            <a href="#top" aria-label="pdflyzer home" className="w-fit">
              <Logo size="sm" />
            </a>

            <p className="text-right text-xs leading-relaxed text-muted-foreground">
              Ask your PDFs anything.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center border-t border-border pt-4">
            <Socials className="justify-self-start" />

            <p className="text-[11px] text-muted-foreground">
              © {new Date().getFullYear()} pdflyzer
            </p>

            <a
              href="#top"
              className="inline-flex items-center justify-self-end gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to top
              <IconArrowUp className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* desktop bottom bar */}
        <div className="mt-2 hidden items-center justify-between text-[11px] text-muted-foreground md:flex">
          <p>© {new Date().getFullYear()} pdflyzer. Ask your PDFs anything.</p>

          <Socials />
        </div>
      </Container>
    </footer>
  );
}

function Socials({ className }: { className?: string }) {
  return (
    <div className={`${className ?? ''} flex items-center gap-1`}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-teal-600/30 hover:text-teal-600 dark:hover:border-teal-300/30 dark:hover:text-teal-300"
        >
          <s.icon className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}

export default Footer;