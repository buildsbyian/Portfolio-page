'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/cv', label: 'CV' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg/80 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      }`}
      style={{ height: 'var(--nav-height)' }}
    >
      <nav className="section-container h-full flex items-center justify-between">
        {/* Monogram */}
        <Link
          href="/"
          className="font-display text-[2rem] md:text-[2.4rem] leading-none tracking-[-0.04em] text-text-primary hover:text-accent transition-colors duration-200"
          aria-label="Home"
        >
          IK
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-10 lg:gap-12">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-mono text-[0.9rem] lg:text-[0.98rem] font-medium uppercase tracking-[0.14em] transition-colors duration-200 hover:text-accent ${
                  isActive(link.href)
                    ? 'text-accent'
                    : 'text-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <motion.span
            className="block w-6 h-[2px] bg-text-primary origin-center"
            animate={isOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-6 h-[2px] bg-text-primary origin-center"
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-6 h-[2px] bg-text-primary origin-center"
            animate={isOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-bg/95 backdrop-blur-2xl md:hidden"
            style={{ top: 'var(--nav-height)' }}
          >
            <nav className="flex flex-col items-center justify-center h-full gap-10 -mt-[var(--nav-height)]">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    className={`font-display text-3xl transition-colors duration-200 hover:text-accent ${
                      isActive(link.href) ? 'text-accent' : 'text-text-primary'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
