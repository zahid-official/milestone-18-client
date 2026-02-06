"use client";

import contactMessage from "@/assets/contact2.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// DropMessage Component
const DropMessage = () => {
  const [isSending, setIsSending] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    const formEl = event.currentTarget || formRef.current;
    if (!formEl) {
      toast.error("Unable to submit the form. Please try again.");
      return;
    }

    const formData = new FormData(formEl);
    const requiredFields = ["name", "email", "phone", "message"];
    const hasEmptyField = requiredFields.some((field) => {
      const value = formData.get(field);
      return typeof value !== "string" || value.trim().length === 0;
    });
    const hasAcceptedTerms = formData.get("terms") === "on";

    if (hasEmptyField || !hasAcceptedTerms) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success("Message sent! We will be in touch soon.");
      formEl.reset();
    }, 900);
  };

  return (
    <section ref={sectionRef} className="">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className={`${revealClass} reveal-delay-1 space-y-6 max-w-xl mx-auto max-lg:order-1`}
        >
          <div className="space-y-2 max-lg:text-center">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              Drop us a line
            </h2>
            <p className="text-sm text-foreground/70">
              Fill out the form below and we will be in touch ASAP.
            </p>
          </div>

          <form
            ref={formRef}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="contact-name">
              Your Name
            </label>
            <Input
              id="contact-name"
              name="name"
              placeholder="Your Name"
              className="h-11 rounded-none"
              disabled={isSending}
            />

            <label className="sr-only" htmlFor="contact-email">
              Email Address
            </label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Email Address"
              className="h-11 rounded-none"
              disabled={isSending}
            />

            <label className="sr-only" htmlFor="contact-phone">
              Contact Number
            </label>
            <Input
              id="contact-phone"
              name="phone"
              type="number"
              placeholder="Contact Number"
              className="h-11 rounded-none"
              disabled={isSending}
            />

            <label className="sr-only" htmlFor="contact-message">
              Your Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Your Message"
              className="min-h-28 w-full rounded-none border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              disabled={isSending}
            />

            <label className="flex items-center gap-3 text-xs text-foreground/70">
              <input
                type="checkbox"
                name="terms"
                className="h-4 w-4 border border-input"
                disabled={isSending}
              />
              <span>
                I have read and agree to the{" "}
                <Link href="/terms" className="text-foreground underline">
                  Terms &amp; Conditions
                </Link>
              </span>
            </label>

            <Button
              type="submit"
              className="h-11 rounded-none px-6 text-sm uppercase"
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <div
          className={`${revealClass} reveal-delay-2 relative min-h-80 sm:min-h-[420px] lg:min-h-[560px] w-full max-w-[440px] mx-auto lg:mx-0 lg:justify-self-center lg:order-1`}
        >
          <Image
            src={contactMessage}
            alt="Dining set vignette"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default DropMessage;
