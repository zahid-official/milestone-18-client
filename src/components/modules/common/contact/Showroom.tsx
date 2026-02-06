"use client";

import contactShowroom from "@/assets/contact1.jpeg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Showroom Component
const Showroom = () => {
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
    <section ref={sectionRef} className="">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className={`${revealClass} reveal-delay-1 relative min-h-[360px] sm:min-h-[480px] lg:min-h-[640px] w-full max-w-[440px] mx-auto lg:mx-0 lg:justify-self-center`}
        >
          <Image
            src={contactShowroom}
            alt="Lorvic showroom seating area"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            priority
          />
        </div>

        <div
          className={`${revealClass} reveal-delay-2 space-y-5 max-lg:text-center`}
        >
          <h2 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl">
            Visit the showroom
          </h2>
          <p className="text-base text-foreground/70">
            Open Tuesday - Saturday 10am - 5pm
          </p>
          <div className="space-y-3 text-sm text-foreground/70">
            <p>
              House Building, Uttara,
              <br />
              Dhaka 1230
            </p>

            <div className="space-y-1">
              <Link
                className="block text-foreground hover:underline"
                href="mailto:zahid.official8@gmail.com"
              >
                zahid.official8@gmail.com
              </Link>
              <Link
                className="block text-foreground hover:underline"
                href="tel:+8801869618216"
              >
                (880) 18696-18216
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showroom;
