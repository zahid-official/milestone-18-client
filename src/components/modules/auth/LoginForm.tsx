"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useHandleActionState from "@/hooks/useHandleActionState";

import loginUser from "@/services/auth/loginUser";
import getFieldError from "@/utils/getFieldError";
import Link from "next/link";
import { useActionState, useRef } from "react";

// Interface for IProps
interface IProps {
  redirect?: string;
}

// LoginForm Component
const LoginForm = ({ redirect }: IProps) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const credentials = {
    admin: {
      email: "default@email.com",
      password: "default@Password123",
    },
    vendor: {
      email: "vendor@email.com",
      password: "default@Password123",
    },
    customer: {
      email: "customer@email.com",
      password: "default@Password123",
    },
  };

  const applyCredentials = (role: keyof typeof credentials) => {
    if (isPending) return;

    const selected = credentials[role];
    if (!selected) return;

    if (emailRef.current) {
      emailRef.current.value = selected.email;
    }

    if (passwordRef.current) {
      passwordRef.current.value = selected.password;
    }

    formRef.current?.requestSubmit();
  };

  // Handle action state side effects
  useHandleActionState(state);

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <form action={formAction} ref={formRef}>
        {/* Add redirect path data to formData by hidden input */}
        {redirect && <Input type="hidden" name="redirect" value={redirect} />}

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
                ref={emailRef}
                className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <FieldError>{getFieldError(state, "email")}</FieldError>
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
                ref={passwordRef}
                className="h-11 w-full rounded-none border border-foreground/60 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <FieldError>{getFieldError(state, "password")}</FieldError>
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

          {/* Credentials */}
          <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
            Or continue with credentials
          </FieldSeparator>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => applyCredentials("admin")}
            >
              Login as Admin
            </Button>

            <Button
              type="button"
              disabled={isPending}
              onClick={() => applyCredentials("customer")}
            >
              Login as Customer
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => applyCredentials("vendor")}
            >
              Login as Vendor
            </Button>
          </div>
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
