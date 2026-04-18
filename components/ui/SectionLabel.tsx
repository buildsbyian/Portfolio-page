interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span className={`label block mb-6 ${className}`}>
      {children}
    </span>
  );
}
