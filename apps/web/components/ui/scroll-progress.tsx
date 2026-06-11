"use client"

import { motion, useScroll, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

type ScrollTone = "brand" | "compite" | "crea" | "conecta"

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: React.Ref<HTMLDivElement>
  tone?: ScrollTone
}

const toneGradients: Record<ScrollTone, string> = {
  brand: "linear-gradient(90deg, #205298 0%, #4F5BA9 55%, #33BEAC 100%)",
  compite: "linear-gradient(90deg, #205298 0%, #2C519B 60%, #4F5BA9 100%)",
  crea: "linear-gradient(90deg, #33BEAC 0%, #46B8A8 55%, #4F5BA9 100%)",
  conecta: "linear-gradient(90deg, #4F5BA9 0%, #6D529E 58%, #33BEAC 100%)",
}

export function ScrollProgress({
  className,
  ref,
  tone = "brand",
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-[2px] origin-left overflow-hidden",
        className
      )}
      style={{
        scaleX: scrollYProgress,
        backgroundImage: toneGradients[tone],
        boxShadow: "0 0 18px rgba(51, 190, 172, 0.28)",
      }}
      {...props}
    />
  )
}
