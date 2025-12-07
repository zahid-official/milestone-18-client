"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import registerUser from "@/services/auth/registerUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

// RegisterForm Component
const RegisterForm = () => {
  // useActionState hook
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const router = useRouter();

  // Helper to fetch a field-specific error message
  const fieldError = (field: string) =>
    state?.errors?.find((error) => error.field === field)?.message;

  // Effect to handle success or error messages
  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "Account created and logged in.");
      if (state.redirectPath) {
        router.push(state.redirectPath as string);
      }
    } else if (!state.errors?.length && state.message) {
      // Only toast API errors; skip local validation errors
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      {/* Register form */}
      <form action={formAction}>
        <FieldSet className="space-y-1">
          {/* Full name */}
          <Field>
            <FieldLabel className="text-[15px] font-semibold text-foreground">
              Full Name
            </FieldLabel>
            <FieldContent>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <FieldError>{fieldError("name")}</FieldError>
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
                name="email"
                placeholder="Type Your Email"
                className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <FieldError>{fieldError("email")}</FieldError>
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
                name="password"
                placeholder="Create a password"
                className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <FieldError>{fieldError("password")}</FieldError>
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
                name="confirmPassword"
                placeholder="Re-enter your password"
                className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <FieldError>{fieldError("confirmPassword")}</FieldError>
            </FieldContent>
          </Field>

          {/* Btn */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-2.5 h-12 w-full rounded-none bg-foreground text-background text-[13px] font-semibold tracking-[0.04em] hover:bg-foreground/90"
          >
            {isPending ? (
              <>
                <Spinner />
                Creating Account...
              </>
            ) : (
              "CREATE ACCOUNT"
            )}
          </Button>
        </FieldSet>
      </form>

      {/* Login redirect */}
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
