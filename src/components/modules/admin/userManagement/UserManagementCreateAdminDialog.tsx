"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useHandleActionState from "@/hooks/useHandleActionState";
import { createAdmin } from "@/services/admin/adminManagement";
import getFieldError from "@/utils/getFieldError";
import { useActionState, useEffect, useState } from "react";

interface UserManagementCreateAdminDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UserManagementCreateAdminDialog = ({
  open,
  onClose,
  onSuccess,
}: UserManagementCreateAdminDialogProps) => {
  const [state, formAction, isPending] = useActionState(createAdmin, null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);

  useHandleActionState(state, {
    successMessage: "Admin created successfully.",
  });

  useEffect(() => {
    if (!state?.success) return;
    onSuccess();
    onClose();
  }, [state, onClose, onSuccess]);

  const handleSubmit = async (formData: FormData) => {
    setConfirmPasswordError(null);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const passwordValue = typeof password === "string" ? password : "";
    const confirmValue =
      typeof confirmPassword === "string" ? confirmPassword : "";

    if (!confirmValue.trim()) {
      setConfirmPasswordError("Confirm password is required.");
      return;
    }

    if (passwordValue !== confirmValue) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    return formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[calc(100%-1.5rem)]">
        <DialogHeader>
          <DialogTitle className="pb-2">Create Admin</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="name">
                Full Name{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter full name"
                  disabled={isPending}
                />
                <FieldError>{getFieldError(state, "name")}</FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">
                Email{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  disabled={isPending}
                />
                <FieldError>{getFieldError(state, "email")}</FieldError>
              </FieldContent>
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="password">
                  Password{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create password"
                    disabled={isPending}
                    onChange={() => setConfirmPasswordError(null)}
                  />
                  <FieldError>{getFieldError(state, "password")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    disabled={isPending}
                    onChange={() => setConfirmPasswordError(null)}
                  />
                  <FieldError>
                    {confirmPasswordError ?? undefined}
                  </FieldError>
                </FieldContent>
              </Field>
            </div>
          </FieldSet>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner />
                  Creating...
                </>
              ) : (
                "Create Admin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementCreateAdminDialog;
