"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import loginUser from "@/services/auth/loginUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

// Interface for IProps
interface IProps {
  redirect?: string;
}

// LoginForm Component
const LoginForm = ({ redirect }: IProps) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const router = useRouter();

  // Helper to get field error message
  const fieldError = (field: string) =>
    state?.errors?.find((error) => error.field === field)?.message;

  // Effect to handle success or error messages
  useEffect(() => {
    if (!state) return;
    if (state.success) {
      router.push(state?.redirectPath as string);
      toast.success(state.message);
    } else if (!state.errors?.length && state.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <form action={formAction}>
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
