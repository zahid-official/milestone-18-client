"use client";

import feature from "@/assets/feature.png";
import featureIcon1 from "@/assets/icons/featureIcon-1.svg";
import featureIcon2 from "@/assets/icons/featureIcon-2.svg";
import featureIcon3 from "@/assets/icons/featureIcon-3.svg";
import featureIcon4 from "@/assets/icons/featureIcon-4.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Feature Component
const Feature = () => {
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

  const features = [
    {
      heading: "Free Shipping",
      text: "Buy product over $100 and get free home delivery offer",
      url: featureIcon1,
    },
    {
      heading: "Easy Return Policy",
      text: "Provide 30 day easy Return policy for all of our customer",
      url: featureIcon2,
    },
    {
      heading: "Secure Payment",
      text: "We conform you that payment system are totally secure",
      url: featureIcon3,
    },
    {
      heading: "Best Quality",
      text: "We never compromize about our quality and always concern",
      url: featureIcon4,
    },
  ];
  const revealClass = isVisible
    ? "reveal-on-scroll is-visible"
    : "reveal-on-scroll";
  const getDelayClass = (index: number) =>
    `reveal-delay-${Math.min(index, 5)}`;

  return (
    <section
      ref={sectionRef}
      className="grid lg:grid-cols-2 items-center justify-center gap-16 lg:py-36 py-24 px-4 max-w-7xl mx-auto w-full"
    >
      {/* Left column */}
      <div className="lg:order-0 order-1 max-sm:flex flex-col justify-center sm:space-y-10 space-y-5">
        <div
          className={`${revealClass} reveal-delay-1 max-lg:text-center max-w-lg max-lg:mx-auto`}
        >
          <h1 className="sm:text-4xl text-3xl font-semibold font-heading">
            Why We are the Best?
          </h1>
          <p className="text-foreground/60 pt-2">
            At Lorvic, we are committed to offering exceptional furniture that
            blends modern design, top-tier comfort, and long-lasting durability.
            Discover why we stand out from the rest:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 justify-center items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${revealClass} ${getDelayClass(
                index + 2
              )} flex max-sm:flex-col gap-3 items-center max-sm:text-center`}
            >
              <Image src={feature.url} alt={feature.heading} />
              <div>
                <h2 className="text-xl font-medium text-foreground/95 font-heading">
                  {feature.heading}
                </h2>
                <p className="text-foreground/60 pt-1">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className={`${revealClass} reveal-delay-3 flex justify-center items-center`}>
        <Image src={feature} alt="feature image"></Image>
      </div>
    </section>
  );
};

export default Feature;
