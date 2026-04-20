'use client';

import { motion, type Variants } from 'motion/react';
import { type ReactNode } from 'react';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const variantMap = {
  fadeUp: fadeUpVariants,
  fadeIn: fadeInVariants,
  slideUp: slideUpVariants,
} as const;

const motionElements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  span: motion.span,
} as const;

interface AnimateInProps {
  children: ReactNode;
  variant?: keyof typeof variantMap;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  as?: keyof typeof motionElements;
}

export default function AnimateIn({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  className = '',
  once = true,
  as = 'div',
}: AnimateInProps) {
  const Component = motionElements[as];
  const variants = variantMap[variant];

  return (
    <Component
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </Component>
  );
}

/**
 * Stagger container — wrap children in AnimateIn components
 * and this will provide sequential delays automatically.
 */
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.06,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
