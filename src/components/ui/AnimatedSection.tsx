// components/ui/AnimatedSection.tsx
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

type Direction = "up" | "down" | "left" | "right" | "zoom";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  
}

const getVariants = (direction: Direction) => {
  switch (direction) {
    case "up":
      return {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      };
    case "down":
      return {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
      };
    case "left":
      return {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
      };
    case "right":
      return {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
      };
    case "zoom":
      return {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
      };
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
  }
};

export default function AnimatedSection({
  children,
  className = "",
  direction = "up",
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, {
    // threshold: 0.1,
    // @ts-ignore
    once: false, // <-- allow re-trigger
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const variants = getVariants(direction);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration: 0.6,
            ease: "easeOut",
            delay: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
