"use client";
import { useEffect, useState } from "react";

const HeaderScrollOverlay = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 transition-colors duration-300 ${
        isScrolled ? "bg-background/90 backdrop-blur" : "bg-transparent"
      }`}
    />
  );
};

export default HeaderScrollOverlay;
