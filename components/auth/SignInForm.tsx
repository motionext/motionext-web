"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Messages } from "@/types/messages";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleIcon } from "@/public/svg/GoogleIcon";

interface SignInFormProps {
  messages: Messages;
}

/**
 * The `SignInForm` function in TypeScript React handles user sign-in, password reset, and Google
 * authentication with appropriate error handling and UI interactions.
 * @param event - The `event` parameter in the `onSubmit` function is a React
 * FormEvent<HTMLFormElement> object. It represents the form submission event triggered when the user
 * submits the sign-in form.
 * @returns The `SignInForm` component is returning a JSX structure that includes a form for signing in
 * with email and password, a link to handle forgot password functionality, a button to sign in with
 * Google, and a message for users who don't have an account yet. The component also includes
 * conditional rendering based on loading states for form submission and forgot password functionality.
 */
export function SignInForm({ messages }: SignInFormProps) {
  const router = useRouter();
  const t = messages.auth;
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * The `onSubmit` function is an asynchronous function that handles the submission of a sign-in form.
   * It prevents the default form submission behavior, sets the loading state to true, and retrieves
   * the form data.
   *
   * @param event - The `event` parameter is a React FormEvent object that represents the form submission
   * event triggered when the user submits the sign-in form.
   */
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

  /**
   * The function `signInWithGoogle` sends a POST request to a Google authentication API endpoint and
   * redirects the user to the authentication URL received in the response.
   * @returns If the response from the server is not ok (status code is not in the range 200-299), an
   * error message is displayed using toast.error. If there is an error during the try block (such as
   * network issues), a generic sign-in error message is displayed.
   */
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

  /**
   * The function `handleForgotPassword` is used to handle the process of sending a reset password
   * email, including validation and displaying appropriate toast messages.
   * @param event - The `event` parameter in the `handleForgotPassword` function is of type
   * `React.MouseEvent<HTMLAnchorElement>`. This means it is an event object that is triggered when a
   * user interacts with an anchor element in a React component. In this case, it is used to handle the
   * click event on
   * @returns The `handleForgotPassword` function returns nothing explicitly, as it does not have a
   * return statement. It may implicitly return `undefined` when it reaches the end of the function.
   */
  async function handleForgotPassword(
    event: React.MouseEvent<HTMLAnchorElement>
  ) {
    event.preventDefault();

    // Get the value of the email field
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const email = emailInput?.value;

    // Check if the email is valid
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
        <GoogleIcon className="mr-2 h-4 w-4" />
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
