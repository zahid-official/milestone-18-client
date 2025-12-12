"use client";
import testimonials1 from "@/assets/testimonials1.jpg";
import testimonials2 from "@/assets/testimonials2.jpg";
import testimonials3 from "@/assets/testimonials3.jpg";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "Ethan Miller",
    designation: "Architect",
    company: "Vancouver, BC",
    testimonial:
      "Lorvic’s furniture brings a perfect balance of form and function. As an architect, I appreciate designs that feel intentional—and Lorvic nails it every time. Their lounge chairs have become my favorite pieces at home.",
    avatar: testimonials1,
  },
  {
    id: 2,
    name: "James Anderson",
    designation: "Entrepreneur",
    company: "Anderson Group",
    testimonial:
      "I was impressed by the build quality and comfort of Lorvic’s new collection. Every piece feels premium, durable, and thoughtfully crafted. It’s rare to find furniture that looks this good and holds up this well.",
    avatar: testimonials2,
  },
  {
    id: 3,
    name: "Olivia Bennett",
    designation: "Interior Stylist",
    company: "Bennett Interiors",
    testimonial:
      "Lorvic has become my top choice when styling spaces for clients. Their furniture instantly elevates any room with its elegant curves and modern textures. The quality is outstanding, and the aesthetic is timeless.",
    avatar: testimonials3,
  },
];

// Testimonial Component
const Testimonial = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    queueMicrotask(() => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    });

    api.on("select", () => {
      queueMicrotask(() => {
        setCurrent(api.selectedScrollSnap() + 1);
      });
    });
  }, [api]);

  return (
    <div className="max-w-5xl mx-auto w-full px-10 lg:pb-36 pb-24 sm:space-y-10 -mt-5 space-y-5">
      <div className="space-y-2 text-center">
        <h2 className="sm:text-4xl text-3xl font-semibold font-heading">
          Testimonials
        </h2>
        <p className="text-foreground/60">{`Let's check what our happy customers says about us`}</p>
      </div>

      {/* Carousel */}
      <div className="container w-full mx-auto px-5">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn("h-3.5 w-3.5 rounded-full border-2", {
                "bg-primary border-primary": current === index + 1,
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) => (
  <div className="sm:mb-8 bg-accent py-8 px-6 sm:py-6">
    <div className="flex items-center justify-between gap-20">
      {/* Image */}
      <div className="hidden lg:block relative shrink-0 aspect-square max-w-[18rem] w-full bg-muted-foreground/20">
        <div className="absolute top-1/4 right-0 translate-x-1/2 h-12 w-12 bg-primary rounded-full flex items-center justify-center">
          <svg
            width="102"
            height="102"
            viewBox="0 0 102 102"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <path
              d="M26.0063 19.8917C30.0826 19.8625 33.7081 20.9066 36.8826 23.024C40.057 25.1414 42.5746 28.0279 44.4353 31.6835C46.2959 35.339 47.2423 39.4088 47.2744 43.8927C47.327 51.2301 44.9837 58.4318 40.2444 65.4978C35.4039 72.6664 28.5671 78.5755 19.734 83.2249L2.54766 74.1759C8.33598 71.2808 13.2548 67.9334 17.3041 64.1335C21.2515 60.3344 23.9203 55.8821 25.3105 50.7765C20.5179 50.4031 16.6348 48.9532 13.6612 46.4267C10.5864 44.0028 9.03329 40.5999 9.00188 36.2178C8.97047 31.8358 10.5227 28.0029 13.6584 24.7192C16.693 21.5381 20.809 19.9289 26.0063 19.8917ZM77.0623 19.5257C81.1387 19.4965 84.7641 20.5406 87.9386 22.6581C91.1131 24.7755 93.6306 27.662 95.4913 31.3175C97.3519 34.9731 98.2983 39.0428 98.3304 43.5268C98.383 50.8642 96.0397 58.0659 91.3004 65.1319C86.4599 72.3005 79.6231 78.2095 70.79 82.859L53.6037 73.8099C59.392 70.9149 64.3108 67.5674 68.3601 63.7676C72.3075 59.9685 74.9763 55.5161 76.3665 50.4105C71.5739 50.0372 67.6908 48.5873 64.7172 46.0608C61.6424 43.6369 60.0893 40.2339 60.0579 35.8519C60.0265 31.4698 61.5787 27.6369 64.7145 24.3532C67.7491 21.1722 71.865 19.563 77.0623 19.5257Z"
              className="fill-primary-foreground"
            />
          </svg>
        </div>
        <Image
          src={testimonial.avatar}
          alt="testimonials image"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Review */}
      <div className="flex flex-col justify-center">
        <div className="flex max-sm:flex-col items-center justify-between gap-2">
          <div className="max-lg:flex max-sm:flex-col max-sm:text-center hidden items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                {testimonial.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.designation}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className="w-5 h-5 fill-muted-foreground stroke-muted-foreground"
              />
            ))}
          </div>
        </div>
        <p className="mt-6 text-lg leading-normal lg:leading-normal! tracking-tight">
          {testimonial.testimonial}
        </p>

        <div className="lg:flex hidden mt-6 items-center gap-4">
          <Avatar>
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {testimonial.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.designation}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Testimonial;
