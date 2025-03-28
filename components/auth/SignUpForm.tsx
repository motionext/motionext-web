"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Messages } from "@/types/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GoogleIcon } from "@/public/svg/GoogleIcon";

interface SignUpFormProps {
  messages: Messages;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * The `SignUpForm` function in TypeScript React handles user sign-up form submission, validation, and
 * authentication options like signing up with Google.
 * @param {FormData} data - The `data` parameter in the `onSubmit` function of the SignUpForm component
 * likely contains form data submitted by a user during the sign-up process. This data typically
 * includes the user's email and password for creating a new account.
 * @returns The `SignUpForm` component is being returned. It consists of a form for user sign-up with
 * fields for email, password, and confirm password. The form includes validation using a form schema,
 * form submission handling functions (`onSubmit` and `signUpWithGoogle`), and UI elements like input
 * fields, password strength indicator, buttons for form submission and Google sign-up, and a link to
 * sign
 */
export function SignUpForm({ messages }: SignUpFormProps) {
  const router = useRouter();
  const t = messages.auth;
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z
    .object({
      email: z
        .string()
        .email({ message: t.emailInvalid })
        .nonempty({ message: t.emailRequired }),
      password: z
        .string()
        .min(8, { message: t.passwordTooShort })
        .regex(/[a-z]/, { message: t.resetPassword.passwordNeedsLowercase })
        .regex(/[A-Z]/, { message: t.resetPassword.passwordNeedsUppercase })
        .regex(/[0-9]/, { message: t.resetPassword.passwordNeedsNumber })
        .nonempty({ message: t.passwordRequired }),
      confirmPassword: z
        .string()
        .min(8, { message: t.passwordTooShort })
        .nonempty({ message: t.passwordRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.passwordsDontMatch,
      path: ["confirmPassword"],
    });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * The `onSubmit` function is an asynchronous function that handles form submission for user sign-up,
   * sending a POST request to the server and displaying success or error messages accordingly.
   * @param {FormData} data - The `data` parameter in the `onSubmit` function is of type `FormData`. It
   * likely contains form data submitted by a user, such as their email and password for signing up.
   * @returns If the response from the fetch request is not ok (status code is not in the range 200-299),
   * an error toast message is shown and the function returns without further action. If the response is
   * successful, a success toast message is shown, and the user is redirected to the "/auth/sign-in"
   * route.
   */
  async function onSubmit(data: FormData) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!response.ok) {
        toast.error(t.signUpError);
        return;
      }

      toast.success(t.signUpSuccess);
      router.push("/auth/sign-in");
    } catch {
      toast.error(t.signUpError);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * The function `signUpWithGoogle` sends a POST request to a Google authentication API endpoint and
   * redirects the user to the authentication URL received in the response.
   * @returns If the response from the server is not ok, an error message will be displayed using
   * toast.error with either the data.error message or a default message t.signUpError. If there is an
   * error during the try block (such as a network error), a generic sign up error message will be
   * displayed using toast.error.
   */
  async function signUpWithGoogle() {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || t.signUpError);
        return;
      }

      // Redirect to the Google authentication URL
      window.location.href = data.url;
    } catch {
      toast.error(t.signUpError);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.email}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.password}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      disabled={isLoading}
                      className="pr-10"
                      {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <PasswordStrength
            password={form.watch("password")}
            requirements={[
              {
                text: t.resetPassword.passwordRequirements,
                validator: (password) => password.length >= 8,
              },
              {
                text: t.resetPassword.passwordNeedsLowercase,
                validator: (password) => /[a-z]/.test(password),
              },
              {
                text: t.resetPassword.passwordNeedsUppercase,
                validator: (password) => /[A-Z]/.test(password),
              },
              {
                text: t.resetPassword.passwordNeedsNumber,
                validator: (password) => /[0-9]/.test(password),
              },
            ]}
            strengthText={{
              weak: t.resetPassword.passwordStrength.weak,
              medium: t.resetPassword.passwordStrength.medium,
              strong: t.resetPassword.passwordStrength.strong,
            }}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.confirmPassword}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      disabled={isLoading}
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? messages.common.loading : t.signUp}
          </Button>
        </form>
      </Form>

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
        onClick={signUpWithGoogle}
        disabled={isLoading}
      >
        <GoogleIcon className="mr-2 h-4 w-4" />
        {t.continueWithGoogle}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {t.alreadyHaveAccount}{" "}
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
