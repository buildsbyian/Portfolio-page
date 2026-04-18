interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'red';
  className?: string;
}

const variantStyles = {
  default: 'bg-surface text-text-secondary border-border',
  accent: 'bg-accent/10 text-accent border-accent/20',
  red: 'bg-red/10 text-red border-red/20',
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
