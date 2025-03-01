"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Messages } from "@/types/messages";
import { Loader2 } from "lucide-react";

interface ForgotPasswordFormProps {
  messages: Messages;
}

export function ForgotPasswordForm({ messages }: ForgotPasswordFormProps) {
  const router = useRouter();
  const t = messages.auth;
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || t.resetPasswordError);
        return;
      }

      setEmailSent(true);
      toast.success(data.message || t.resetPasswordSuccess);
    } catch (error) {
      toast.error(t.resetPasswordError);
    } finally {
      setIsLoading(false);
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
            {t.resetPasswordEmailSent}
          </h3>
          <p className="text-green-700 dark:text-green-400">
            {t.resetPasswordCheckEmail}
          </p>
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={() => router.push("/auth/sign-in")}
        >
          {t.backToSignIn}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t.sendResetLink}</span>
              </div>
            ) : (
              t.sendResetLink
            )}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t.rememberPassword}{" "}
        <Link
          href="/auth/sign-in"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t.signIn}
        </Link>
      </p>
    </div>
  );
}
