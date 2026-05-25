"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { ParticlesProvider, type ParticlesPluginRegistrar, type IParticlesProps } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import C3DotPattern from "./C3DotPattern";
import { getC3Intensity, getC3LineTheme, type C3BackgroundIntensity, type C3LineKey } from "./c3-background-theme";

type C3ParticlesProps = {
  line?: C3LineKey;
  intensity?: C3BackgroundIntensity;
  animated?: boolean;
  className?: string;
};

const particlesInit: ParticlesPluginRegistrar = async (engine) => {
  await loadSlim(engine);
};

const particleMap: Record<C3BackgroundIntensity, number> = {
  low: 10,
  medium: 14,
  high: 18,
};

export default function C3Particles({
  line = "brand",
  intensity = "low",
  animated = true,
  className = "",
}: C3ParticlesProps) {
  const theme = getC3LineTheme(line);
  const scale = getC3Intensity(intensity);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const update = () => {
      setPrefersReducedMotion(reduceMotionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    update();
    reduceMotionQuery.addEventListener("change", update);
    mobileQuery.addEventListener("change", update);

    return () => {
      reduceMotionQuery.removeEventListener("change", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, []);

  const shouldUseParticles = animated && !prefersReducedMotion && !isMobile;

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },
      fpsLimit: 30,
      detectRetina: true,
      background: {
        color: {
          value: "transparent",
        },
      },
      particles: {
        number: {
          value: particleMap[intensity],
          density: {
            enable: true,
            width: 900,
            height: 900,
          },
        },
        color: {
          value: [theme.primary, theme.secondary, theme.accent],
        },
        links: {
          enable: true,
          color: theme.primary,
          distance: 132,
          opacity: 0.18,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.38,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
        },
        opacity: {
          value: {
            min: 0.08,
            max: 0.22,
          },
        },
        size: {
          value: {
            min: 1,
            max: 2.2,
          },
        },
      },
    }) satisfies IParticlesProps["options"],
    [intensity, theme.accent, theme.primary, theme.secondary],
  );

  if (!shouldUseParticles) {
    return (
      <C3DotPattern
        line={line}
        intensity={intensity}
        animated={false}
        mask="both"
        size={isMobile ? 40 : 34}
        opacity={scale.opacity * 0.72}
        className={className}
      />
    );
  }

  const particlesLoaded = async (): Promise<void> => {};

  return (
    <div aria-hidden="true" className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <ParticlesProvider init={particlesInit}>
        <Particles
          id={`c3-particles-${line}`}
          className="absolute inset-0 h-full w-full"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      </ParticlesProvider>
    </div>
  );
}
