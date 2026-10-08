import { ButtonLink } from '@/components/ui/button';
import Container from '@/components/ui/container';
import Drawer from '@/components/ui/drawer';
import Logo from '@/components/ui/logo';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/useAuth';
import { IconArrowRight, IconMenu2 } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' },
];

function Navbar() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl'>
      <Container className='flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]'>
        <Link to='/' aria-label='pdflyzer home'>
          <Logo />
        </Link>

        <nav
          className='hidden items-center justify-center gap-1 md:flex'
          aria-label='Primary'
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className='hidden items-center justify-end gap-3 md:flex'>
          <ThemeToggle />
          {isAuthenticated ? (
            <ButtonLink
              to='/dashboard'
              variant='brand'
              size='md'
              className='group'
            >
              Go to Dashboard
              <IconArrowRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
            </ButtonLink>
          ) : (
            <>
              <ButtonLink to='/login' variant='ghost' size='md'>
                Sign in
              </ButtonLink>
              <ButtonLink
                to='/register'
                variant='brand'
                size='md'
                className='group'
              >
                Get started
                <IconArrowRight className='h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5' />
              </ButtonLink>
            </>
          )}
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <button
            type='button'
            aria-label='Open menu'
            aria-expanded={open}
            aria-controls='mobile-menu'
            onClick={() => setOpen(true)}
            className='flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground'
          >
            <IconMenu2 className='h-5 w-5' />
          </button>
        </div>
      </Container>

      <Drawer
        id='mobile-menu'
        open={open}
        onClose={() => setOpen(false)}
        title={<Logo size='sm' />}
      >
        <nav className='flex flex-col gap-1' aria-label='Mobile'>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className='rounded-lg px-3 py-3 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className='mt-6 flex flex-col gap-3 border-t border-border pt-6'>
          {isAuthenticated ? (
            <ButtonLink
              to='/dashboard'
              variant='outline'
              size='lg'
              className='w-full'
              onClick={() => setOpen(false)}
            >
              Go to Dashboard
            </ButtonLink>
          ) : (
            <>
              <ButtonLink
                to='/login'
                variant='outline'
                size='lg'
                className='w-full'
                onClick={() => setOpen(false)}
              >
                Sign in
              </ButtonLink>
              <ButtonLink
                to='/register'
                variant='brand'
                size='lg'
                className='w-full'
                onClick={() => setOpen(false)}
              >
                Get started free
              </ButtonLink>
            </>
          )}
        </div>
      </Drawer>
    </header>
  );
}

export default Navbar;
