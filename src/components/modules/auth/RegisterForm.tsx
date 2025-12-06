import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";

// RegisterForm Component
const RegisterForm = () => {
  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <FieldSet className="space-y-1">
        {/* Full name */}
        <Field>
          <FieldLabel className="text-[15px] font-semibold text-foreground">
            Full Name
          </FieldLabel>
          <FieldContent>
            <input
              type="text"
              placeholder="Enter your full name"
              className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </FieldContent>
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel className="text-[15px] font-semibold text-foreground">
            Email Address
          </FieldLabel>
          <FieldContent>
            <input
              type="email"
              placeholder="Type Your Email"
              className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </FieldContent>
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel className="text-[15px] font-semibold text-foreground">
            Password
          </FieldLabel>
          <FieldContent>
            <input
              type="password"
              placeholder="Create a password"
              className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </FieldContent>
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel className="text-[15px] font-semibold text-foreground">
            Confirm Password
          </FieldLabel>
          <FieldContent>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            />
          </FieldContent>
        </Field>

        {/* Btn */}
        <Button
          type="submit"
          className="mt-2.5 h-12 w-full rounded-none bg-foreground text-background text-[13px] font-semibold tracking-[0.04em] hover:bg-foreground/90"
        >
          CREATE ACCOUNT
        </Button>
      </FieldSet>

      <div className="text-sm text-muted-foreground pb-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
