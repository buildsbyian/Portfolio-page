import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 md:py-10">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Left: Links */}
          <div className="flex items-center gap-8">
            <a
              href="mailto:iankuksov.work@gmail.com"
              className="font-mono text-sm text-text-secondary hover:text-accent transition-colors duration-200"
              aria-label="Send email"
            >
              Email
            </a>

            <a
              href="https://www.linkedin.com/in/ian-kuksov-5b8a952bb/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors duration-200 inline-flex items-center gap-2"
              aria-label="LinkedIn Profile"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="font-mono text-sm">LinkedIn</span>
            </a>
          </div>

          {/* Right: Copyright */}
          <p className="text-sm text-text-secondary font-mono">
            © {new Date().getFullYear()} Ian Kuksov
          </p>
        </div>
      </div>
    </footer>
  );
}
