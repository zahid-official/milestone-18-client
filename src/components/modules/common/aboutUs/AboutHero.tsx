"use client";

import about1 from "@/assets/about1.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AboutHero = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || isVisible) return;
        if (revealTimeoutRef.current) {
          clearTimeout(revealTimeoutRef.current);
        }
        revealTimeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          observer.disconnect();
        }, 200);
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, [isVisible]);

  const revealClass = isVisible
    ? "reveal-on-scroll is-visible"
    : "reveal-on-scroll";

  return (
    <div
      ref={sectionRef}
      className="grid overflow-hidden border border-muted/60 lg:grid-cols-[1.1fr_1fr]"
    >
      <div
        className={`${revealClass} reveal-delay-1 flex flex-col justify-between bg-[#3B3F2C] px-10 py-12 text-white sm:px-12 sm:py-16`}
      >
        <h1 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          A curated collection of timeless pieces
        </h1>
        <p className="mt-10 max-w-md text-sm leading-relaxed text-white/85">
          Lorvic is a modern furniture destination shaped by calm palettes,
          natural textures, and confident silhouettes. Every piece is selected
          to feel effortless, functional, and lasting.
        </p>
      </div>
      <div
        className={`${revealClass} reveal-delay-2 relative min-h-[300px] sm:min-h-[360px] lg:min-h-[480px]`}
      >
        <Image
          src={about1}
          alt="Curated furniture vignette"
          fill
          sizes="(min-width: 1024px) 480px, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default AboutHero;
