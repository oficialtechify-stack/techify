import React from 'react';
import { motion } from 'motion/react';

interface TextEmergenceProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  blur?: number;
  yOffset?: number;
  className?: string;
  glow?: boolean;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export default function TextEmergence({
  children,
  delay = 0,
  duration = 0.7,
  blur = 14,
  yOffset = 22,
  className = '',
  glow = false,
  once = false, // Replays on every scroll down/up
  as: Component = 'div',
}: TextEmergenceProps) {
  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blur}px)`,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        scale: 1,
      }}
      viewport={{
        once: once,
        amount: 0.15,
        margin: '0px 0px -30px 0px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Cinematic exponential ease-out
      }}
      className={`${className} ${glow ? 'hover:drop-shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all' : ''}`}
    >
      {children}
    </MotionComponent>
  );
}

// Split words emergence for extra dramatic effect
export function WordsEmergence({
  text,
  className = '',
  delay = 0,
  stagger = 0.05,
  blur = 12,
  once = false
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  blur?: number;
  once?: boolean;
}) {
  const words = text.split(' ');

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, amount: 0.2 }}
      className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: {
              opacity: 0,
              y: 18,
              filter: `blur(${blur}px)`,
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: {
                duration: 0.6,
                delay: delay + index * stagger,
                ease: [0.16, 1, 0.3, 1],
              },
            },
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
