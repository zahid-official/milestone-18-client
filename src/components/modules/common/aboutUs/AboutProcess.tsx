"use client";

import {
  Boxes,
  Handshake,
  Leaf,
  LifeBuoy,
  PackageCheck,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const processSteps = [
  {
    title: "Curation",
    body: "We select pieces that feel timeless, comfortable, and quietly bold, so every room feels composed and lived-in.",
    icon: Boxes,
  },
  {
    title: "Partnership",
    body: "We collaborate with craftspeople who share our standards for materials, ethics, and long-lasting quality.",
    icon: Handshake,
  },
  {
    title: "Delivery",
    body: "From warehouse to doorstep, we prioritize careful handling and reliable timelines for a smooth experience.",
    icon: Truck,
  },
  {
    title: "Support",
    body: "We stay with you after purchase, helping with care guidance and styling advice when you need it.",
    icon: LifeBuoy,
  },
  {
    title: "Ethical Sourcing",
    body: "We work with partners who prioritize fair labor practices and responsibly sourced materials.",
    icon: PackageCheck,
  },
  {
    title: "Sustainable Materials",
    body: "We choose finishes and fabrics that reduce impact while preserving durability and beauty.",
    icon: Leaf,
  },
];

const AboutProcess = () => {
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
  const getDelayClass = (index: number) =>
    `reveal-delay-${Math.min(index, 5)}`;

  return (
    <div ref={sectionRef} className="space-y-8">
      <div className={`${revealClass} reveal-delay-1 max-w-2xl space-y-3`}>
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl text-foreground/80">
          Our Process
        </h2>
        <p className="text-sm text-foreground/70">
          A thoughtful path from concept to home, built around clarity,
          craftsmanship, and care.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {processSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className={`${revealClass} ${getDelayClass(
                index + 2
              )} space-y-3 border border-muted/60 bg-background p-6 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-[0_24px_50px_-32px_rgba(15,23,42,0.45)]`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted/60 bg-lorvic/60">
                <Icon className="h-5 w-5 text-foreground/70" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-sm text-foreground/70">{step.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AboutProcess;
