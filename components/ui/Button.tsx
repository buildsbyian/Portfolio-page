import Link from 'next/link';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'filled' | 'ghost';
  onClick?: () => void;
  className?: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}

export default function Button({
  children,
  href,
  variant = 'filled',
  onClick,
  className = '',
  download,
  target,
  rel,
  type = 'button',
  ariaLabel,
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-mono tracking-wide transition-all duration-200 rounded-none';

  const variantStyles = {
    filled:
      'bg-accent text-bg hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]',
    ghost:
      'bg-transparent text-text-primary border border-border hover:border-accent hover:text-accent hover:scale-[1.02] active:scale-[0.98]',
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${className}`;

  // External link or download
  if (href && (target === '_blank' || download)) {
    return (
      <a
        href={href}
        className={classes}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        download={download}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  // Internal link
  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  // Button
  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
