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
import loginUser, { type LoginActionState } from "@/services/auth/loginUser";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

// LoginForm Component
const LoginForm = () => {
  const [state, formAction, isPending] = useActionState<
    LoginActionState | null,
    FormData
  >(loginUser, null);

  const fieldError = (field: string) =>
    state?.errors?.find((error) => error.field === field)?.message;

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(state.message || "Logged in successfully.");
    } else if (!state.errors?.length && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <form action={formAction}>
        <FieldSet className="space-y-1">
          {/* Email */}
          <Field>
            <FieldLabel className="text-[15px] font-semibold text-foreground">
              Email Address
            </FieldLabel>
            <FieldContent>
              <input
                type="email"
                name="email"
                autoComplete="email"
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
                autoComplete="current-password"
                placeholder="Enter Your Password"
                className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <FieldError>{fieldError("password")}</FieldError>
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
                Logging in...
              </>
            ) : (
              "LOG IN"
            )}
          </Button>
        </FieldSet>
      </form>

      <div className="text-sm text-muted-foreground pb-2">
        Don’t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-foreground underline underline-offset-4"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
