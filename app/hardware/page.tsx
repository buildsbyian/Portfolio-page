import type { Metadata } from 'next';
import SectionLabel from '@/components/ui/SectionLabel';

export const metadata: Metadata = {
  title: 'Hardware & 3D',
  description: 'Physical product development, 3D printing, electronics, and custom hardware projects.',
};

export default function HardwarePage() {
  return (
    <section className="section-container py-24 md:py-32">
      <SectionLabel>Hardware & 3D</SectionLabel>
      <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
        Hardware & 3D
      </h1>
      <p className="font-mono text-sm text-text-secondary max-w-md">
        Visual grid of hardware projects, 3D prints, and Vostok Labs work. Coming soon.
      </p>
    </section>
  );
}
