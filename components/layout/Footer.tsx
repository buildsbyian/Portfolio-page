import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="section-container py-16 md:py-20">
        {/* CTA */}
        <div className="mb-12">
          <p className="font-display text-2xl md:text-3xl text-text-primary leading-snug max-w-lg">
            Looking for a CoS or operator who ships?{' '}
            <span className="text-accent">Let&apos;s talk.</span>
          </p>
        </div>

        {/* Links & Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="flex items-center gap-6">
            {/* Email */}
            <a
              href="mailto:ian@example.com"
              className="label hover:text-accent transition-colors duration-200"
              aria-label="Send email"
            >
              Email
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/iankuksov"
              target="_blank"
              rel="noopener noreferrer"
              className="label hover:text-accent transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-text-secondary font-mono">
            © {new Date().getFullYear()} Ian Kuksov
          </p>
        </div>
      </div>
    </footer>
  );
}
