interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'red';
  className?: string;
}

const variantStyles = {
  default: 'bg-surface text-text-secondary border-border',
  accent: 'bg-surface text-accent border-accent/35',
  red: 'bg-surface text-red border-red/30',
};

export default function Tag({ children, variant = 'default', className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 font-mono text-base uppercase tracking-[0.12em] border rounded-none ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
