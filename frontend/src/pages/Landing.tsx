import CTA from '@/components/landing/CTA';
import FAQ from '@/components/landing/FAQ';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Navbar from '@/components/landing/Navbar';
import Security from '@/components/landing/Security';

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-teal-300/30 selection:text-teal-900 dark:selection:text-teal-100">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Security />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;