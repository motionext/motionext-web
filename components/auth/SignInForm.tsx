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

interface SignInFormProps {
  messages: Messages;
}

export function SignInForm({ messages }: SignInFormProps) {
  const router = useRouter();
  const t = messages.auth;
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error(t.invalidCredentials);
        return;
      }

      router.refresh();
      router.push("/");
    } catch {
      toast.error(t.signInError);
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || t.signInError);
        return;
      }

      // Redirect to the Google authentication URL
      window.location.href = data.url;
    } catch {
      toast.error(t.signInError);
    }
  }

  async function handleForgotPassword(
    event: React.MouseEvent<HTMLAnchorElement>
  ) {
    event.preventDefault();
    
    // Obter o valor do campo de email
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput?.value;
    
    // Verificar se o email é válido
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t.emailRequired);
      return;
    }
    
    setIsForgotPasswordLoading(true);
    
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Always show success message, even if the email does not exist
      // This is a security measure to prevent email enumeration
      toast.success(t.resetPasswordEmailSent);
      toast.info(t.resetPasswordCheckEmail);
    } catch {
      toast.error(t.resetPasswordError);
    } finally {
      setIsForgotPasswordLoading(false);
    }
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
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.password}</Label>
              <Link
                href="#"
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={handleForgotPassword}
              >
                {isForgotPasswordLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {messages.common.loading}
                  </span>
                ) : (
                  t.forgotPassword
                )}
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? messages.common.loading : t.signIn}
          </Button>
        </div>
      </form>
      <div className="relative flex items-center">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
        <span className="mx-2 text-xs uppercase text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2">
          ou
        </span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600" />
      </div>
      <Button
        variant="outline"
        type="button"
        onClick={signInWithGoogle}
        disabled={isLoading}
      >
        <svg
          className="mr-2 h-4 w-4"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="google"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 488 512"
        >
          <path
            fill="currentColor"
            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          ></path>
        </svg>
        {t.continueWithGoogle}
      </Button>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t.dontHaveAccount}{" "}
        <Link
          href="/auth/sign-up"
          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t.signUp}
        </Link>
      </p>
    </div>
  );
}
