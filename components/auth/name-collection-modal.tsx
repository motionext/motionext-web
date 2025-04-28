"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Messages } from "@/types/messages";
import { z } from "zod";
import { checkInappropriateContent } from "@/lib/utils";
import { toast } from "sonner";

interface NameCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (firstName: string, lastName: string) => void;
  messages: Messages;
}

export function NameCollectionModal({ isOpen, onClose, onSubmit, messages }: NameCollectionModalProps) {
  const t = messages.auth.nameCollection;
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);

  const nameSchema = {
    firstName: z.string()
      .min(1, t.error.firstNameRequired)
      .max(50, t.error.firstNameTooLong)
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, t.error.invalidFirstName)
      .transform((val) => val.trim()),
    
    lastName: z.string()
      .min(1, t.error.lastNameRequired)
      .max(50, t.error.lastNameTooLong)
      .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, t.error.invalidLastName)
      .transform((val) => val.trim())
  };

  const validateFirstName = (value: string, checkContent = false) => {
    try {
      nameSchema.firstName.parse(value);
      
      // Check inappropriate content only on submission
      if (checkContent) {
        const contentCheck = checkInappropriateContent(value, messages);
        if (!contentCheck.isValid) {
          setFirstNameError(t.error.inappropriateContent);
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
          setLastNameError(t.error.inappropriateContent);
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
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>
            {t.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              {t.firstName}
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
              {t.lastName}
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
            disabled={isSubmitting || !firstName.trim() || !lastName.trim() || !!firstNameError || !!lastNameError}
          >
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 