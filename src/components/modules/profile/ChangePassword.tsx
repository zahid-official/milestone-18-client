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
import useHandleActionState from "@/hooks/useHandleActionState";
import changePassword from "@/services/auth/changePassword";
import getFieldError from "@/utils/getFieldError";
import { useActionState } from "react";

// ChangePassword Component
const ChangePassword = () => {
  const [state, formAction, isPending] = useActionState(changePassword, null);

  useHandleActionState(state, {
    successMessage: "Password changed successfully.",
  });

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold leading-tight text-foreground">
          Change Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your current password and set a new one.
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <FieldSet className="space-y-3 rounded-lg border bg-background p-5 shadow-sm">
          <Field className="pt-6">
            <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
            <FieldContent>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                placeholder="Enter current password"
                className="h-10 w-full rounded-md border border-input px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              />
              <FieldError>{getFieldError(state, "oldPassword")}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <FieldContent>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                className="h-10 w-full rounded-md border border-input px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              />
              <FieldError>{getFieldError(state, "newPassword")}</FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <FieldContent>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                className="h-10 w-full rounded-md border border-input px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isPending}
              />
              <FieldError>{getFieldError(state, "confirmPassword")}</FieldError>
            </FieldContent>
          </Field>

          <div className="flex items-center justify-end gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </FieldSet>
      </form>
    </div>
  );
};

export default ChangePassword;
