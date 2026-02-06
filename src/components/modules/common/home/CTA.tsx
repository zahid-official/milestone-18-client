"use client";

import ctaImage from "@/assets/cta.jpg";
import ctaSmaller from "@/assets/ctaSmaller.jpg";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// CTA Component
const CTA = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#213E40] text-white px-4 max-w-7xl xl:mb-36 mx-auto w-full"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
      >
        <div className="absolute -left-28 top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl items-center sm:px-4 px-2 lg:py-9 sm:pt-9 pt-7 pb-26">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div
            className={`${revealClass} reveal-delay-1 overflow-hidden border border-white/10 bg-white/5 p-3 shadow-[0_25px_60px_-35px_rgba(0,0,0,0.8)]`}
          >
            <Image
              src={ctaSmaller}
              alt="Leisure chair set arrangement"
              className="h-full w-full object-cover lg:hidden"
              priority
            />
            <Image
              src={ctaImage}
              alt="Leisure chair set arrangement"
              className="hidden h-full w-full object-cover lg:block"
              priority
            />
          </div>

          <div
            className={`${revealClass} reveal-delay-2 order-1 space-y-4 text-center lg:order-2 lg:text-left`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              New Collections
            </p>
            <h2 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Leisure Chair Set
            </h2>
            <p className="mx-auto max-w-lg text-base pt-1 pb-3 text-white/70 lg:mx-0">
              Discover sculpted comfort with warm textures and soft curves. This
              set pairs effortless lounging with a refined, modern silhouette.
            </p>
            <Link href="/shop">
              <Button className="h-12 px-8 text-sm uppercase font-semibold">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
