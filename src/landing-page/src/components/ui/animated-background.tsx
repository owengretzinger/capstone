"use client";
import { cn } from "@/src/lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import React from "react";

export const AnimatedBackground = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <div
      className={cn(
        "group relative flex w-full items-center justify-center bg-background",
        containerClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0 bg-dot-thick-neutral-200/70 dark:bg-dot-thick-neutral-200/10" />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 bg-dot-thick-indigo-500/40 group-hover:opacity-100 dark:bg-dot-thick-indigo-500/30"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.span
      initial={{
        backgroundSize: "0% 100%",
      }}
      animate={{
        backgroundSize: "100% 100%",
      }}
      transition={{
        duration: 1,
        ease: "linear",
        delay: 0.5,
      }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        `relative inline-block rounded-lg bg-gradient-to-r from-yellow-400/50 to-yellow-400/50 px-1 pb-1`,
        className,
      )}
    >
      {children}
    </motion.span>
  );
};
