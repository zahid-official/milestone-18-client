import Link from "next/link";
import CommonLayout from "@/app/(commonLayout)/layout";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const NotFound = () => {
  return (
    <CommonLayout>
      <div className="bg-background">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-lorvic/60 via-background to-background" />

          <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-32 sm:pt-36">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-7">
                <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                  Error 404
                </p>
                <div className="space-y-4">
                  <h1 className="text-4xl font-semibold font-heading sm:text-5xl">
                    Page not found.
                  </h1>
                  <p className="max-w-xl text-muted-foreground">
                    The page you are looking for was moved, removed, or never
                    existed. Use the options below to get back on track.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/">Go to Homepage</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/shop">Browse Shop</Link>
                  </Button>
                </div>

                <div className="border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                  If you typed the URL, check the spelling and try again.
                </div>
              </div>

              <div className="relative border bg-background/90 shadow-sm">
                <div className="pointer-events-none absolute -top-12 right-8 hidden text-[120px] font-heading text-muted/15 lg:block">
                  404
                </div>

                <div className="border-b bg-lorvic/55 px-7 py-8">
                  <p className="text-sm text-muted-foreground">
                    Popular destinations
                  </p>
                  <p className="mt-2 text-2xl font-semibold font-heading">
                    Continue browsing
                  </p>
                </div>

                <div className="space-y-5 px-7 py-7">
                  <div className="grid gap-3 text-sm">
                    <Link
                      href="/shop"
                      className="group flex items-center justify-between border bg-background/70 px-4 py-3 transition hover:shadow-sm"
                    >
                      <span className="font-medium">Shop</span>
                      <span className="text-muted-foreground">View</span>
                    </Link>
                    <Link
                      href="/about-us"
                      className="group flex items-center justify-between border bg-background/70 px-4 py-3 transition hover:shadow-sm"
                    >
                      <span className="font-medium">About Us</span>
                      <span className="text-muted-foreground">View</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="group flex items-center justify-between border bg-background/70 px-4 py-3 transition hover:shadow-sm"
                    >
                      <span className="font-medium">Contact</span>
                      <span className="text-muted-foreground">View</span>
                    </Link>
                    <Link
                      href="/"
                      className="group flex items-center justify-between border bg-background/70 px-4 py-3 transition hover:shadow-sm"
                    >
                      <span className="font-medium">Home</span>
                      <span className="text-muted-foreground">View</span>
                    </Link>
                  </div>

                  <div className="border bg-muted/30 px-4 py-4 text-sm text-muted-foreground">
                    Need help finding something? Contact our team and we will
                    point you in the right direction.
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </CommonLayout>
  );
};

export default NotFound;
