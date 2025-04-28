"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Messages } from "@/types/messages";
import { checkInappropriateContent } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";

interface NameCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName: string) => void;
  messages: Messages;
}

export function NameCollectionModal({
  isOpen,
  onClose,
  onSubmit,
  messages,
}: NameCollectionModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  const nameSchema = {
    firstName: z
      .string()
      .min(1, messages.auth.nameCollection.error.firstNameRequired)
      .max(50, messages.auth.nameCollection.error.firstNameTooLong)
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        messages.auth.nameCollection.error.invalidFirstName
      )
      .transform((val) => val.trim()),

    lastName: z
      .string()
      .min(1, messages.auth.nameCollection.error.lastNameRequired)
      .max(50, messages.auth.nameCollection.error.lastNameTooLong)
      .regex(
        /^[a-zA-ZÀ-ÿ\s'-]+$/,
        messages.auth.nameCollection.error.invalidLastName
      )
      .transform((val) => val.trim()),
  };

  const validateFirstName = (value: string, checkContent = false) => {
    try {
      nameSchema.firstName.parse(value);

      // Check inappropriate content only on submission
      if (checkContent) {
        const contentCheck = checkInappropriateContent(value, messages);
        if (!contentCheck.isValid) {
          setFirstNameError(
            messages.contentFilter.errors.inappropriate_word_reserved
          );
          if (contentCheck.reason) {
            toast.error(contentCheck.reason);
          }
          return false;
        }
      }

      setFirstNameError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFirstNameError(error.errors[0].message);
      }
      return false;
    }
  };

  const validateLastName = (value: string, checkContent = false) => {
    try {
      nameSchema.lastName.parse(value);

      // Check inappropriate content only on submission
      if (checkContent) {
        const contentCheck = checkInappropriateContent(value, messages);
        if (!contentCheck.isValid) {
          setLastNameError(
            messages.contentFilter.errors.inappropriate_word_reserved
          );
          if (contentCheck.reason) {
            toast.error(contentCheck.reason);
          }
          return false;
        }
      }

      setLastNameError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setLastNameError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);
    validateFirstName(value, false);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);
    validateLastName(value, false);
  };

  const handleSubmit = () => {
    const isFirstNameValid = validateFirstName(firstName, true);
    const isLastNameValid = validateLastName(lastName, true);

    if (!isFirstNameValid || !isLastNameValid) return;

    setIsSubmitting(true);
    onSubmit(firstName.trim(), lastName.trim());
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{messages.auth.nameCollection.title}</DialogTitle>
          <DialogDescription>
            {messages.auth.nameCollection.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              {messages.auth.nameCollection.firstName}
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
                className={firstNameError ? "border-red-500" : ""}
                autoFocus
                required
              />
              {firstNameError && (
                <p className="text-xs text-red-500">{firstNameError}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              {messages.auth.nameCollection.lastName}
            </Label>
            <div className="col-span-3 space-y-1">
              <Input
                id="lastName"
                value={lastName}
                onChange={handleLastNameChange}
                className={lastNameError ? "border-red-500" : ""}
                required
              />
              {lastNameError && (
                <p className="text-xs text-red-500">{lastNameError}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !firstName.trim() ||
              !lastName.trim() ||
              !!firstNameError ||
              !!lastNameError
            }
          >
            {isSubmitting
              ? messages.auth.nameCollection.submitting
              : messages.auth.nameCollection.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
