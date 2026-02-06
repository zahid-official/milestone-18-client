"use client";

import about2 from "@/assets/about2.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const AboutCraft = () => {
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
    <div ref={sectionRef} className="grid items-center gap-12 lg:grid-cols-2">
      <div
        className={`${revealClass} reveal-delay-1 relative min-h-[280px] sm:min-h-[340px] lg:min-h-[420px]`}
      >
        <div className="absolute inset-0 border border-muted/60 bg-white shadow-[0_20px_40px_-30px_rgba(15,23,42,0.35)]" />
        <Image
          src={about2}
          alt="Design curation desk"
          fill
          sizes="(min-width: 1024px) 520px, 100vw"
          className="object-cover"
        />
      </div>
      <div className={`${revealClass} reveal-delay-2 max-w-md space-y-5`}>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground/50">
          Timeless craft
        </p>
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
          Crafted with intention, curated for everyday living.
        </h2>
        <p className="text-sm text-foreground/70">
          We blend clean lines with tactile materials so every room feels
          grounded and inviting. From concept to delivery, Lorvic focuses on
          clarity, comfort, and long-term value.
        </p>
      </div>
    </div>
  );
};

export default AboutCraft;
