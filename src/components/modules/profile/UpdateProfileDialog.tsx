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
import { updateProfileInfo } from "@/services/user/userManagement";
import getFieldError from "@/utils/getFieldError";
import { IUser } from "@/types";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface IUpdateProfileDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: IUser | null;
}

// UpdateProfileDialog Component
const UpdateProfileDialog = ({
  open,
  onClose,
  onSuccess,
  user,
}: IUpdateProfileDialogProps) => {
  const [state, formAction, isPending] = useActionState(
    updateProfileInfo,
    null
  );
  const [clientFileError, setClientFileError] = useState<string | null>(null);
  const MAX_FILE_BYTES = 4.5 * 1024 * 1024;

  useHandleActionState(state);

  useEffect(() => {
    if (!state?.success) return;
    onSuccess();
    onClose();
  }, [state, onClose, onSuccess]);

  const handleSubmit = async (formData: FormData) => {
    setClientFileError(null);
    const file = formData.get("file");

    if (file instanceof File && file.size > MAX_FILE_BYTES) {
      setClientFileError("Image must be 4.5MB or smaller.");
      return;
    }

    const getTextValue = (value: FormDataEntryValue | null) =>
      typeof value === "string" && value.trim().length > 0
        ? value.trim()
        : undefined;

    const payload = {
      name: getTextValue(formData.get("name")),
      phone: getTextValue(formData.get("phone")),
      address: getTextValue(formData.get("address")),
    };

    const hasBodyChanges = [
      payload.name !== undefined && payload.name !== (user?.name || ""),
      payload.phone !== undefined && payload.phone !== (user?.phone || ""),
      payload.address !== undefined &&
        payload.address !== (user?.address || ""),
    ].some(Boolean);
    const hasFileUpdate = file instanceof File && file.size > 0;

    if (!hasBodyChanges && !hasFileUpdate) {
      toast.warning("No changes to update.");
      return;
    }

    return formAction(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-w-[calc(100%-1.5rem)]">
        <DialogHeader>
          <DialogTitle className="pb-2">Edit Profile</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <FieldSet>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    defaultValue={user?.name}
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "name")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed.
                  </p>
                </FieldContent>
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <FieldContent>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+8801XXXXXXXXX"
                    defaultValue={user?.phone}
                    disabled={isPending}
                  />
                  <FieldError>{getFieldError(state, "phone")}</FieldError>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="file">Profile Photo</FieldLabel>
                <FieldContent>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    disabled={isPending}
                  />
                  <FieldError>
                    {clientFileError ?? getFieldError(state, "file")}
                  </FieldError>
                  <p className="text-xs text-muted-foreground">
                    Leave blank to keep the current photo.
                  </p>
                </FieldContent>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <FieldContent>
                <textarea
                  id="address"
                  name="address"
                  placeholder="House, street, city"
                  className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={user?.address}
                  disabled={isPending}
                />
                <FieldError>{getFieldError(state, "address")}</FieldError>
              </FieldContent>
            </Field>
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
                  Saving...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
