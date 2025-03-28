"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Messages } from "@/types/messages";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  messages: Messages["auth"]["resetPassword"];
}

/**
 * The `ResetPasswordForm` function in TypeScript React handles the form submission for resetting a
 * user's password securely with error handling and success messages.
 * @param {ResetPasswordFormProps}  - The code you provided is a React component called
 * `ResetPasswordForm` that handles the process of resetting a user's password. Here's a breakdown of
 * the key aspects of the code:
 * @returns The `ResetPasswordForm` component returns different UI elements based on the state of the
 * form submission process. Here's a breakdown of what is being returned:
 */
export function ResetPasswordForm({ messages }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: messages.passwordTooShort })
        .regex(/[a-z]/, { message: messages.passwordNeedsLowercase })
        .regex(/[A-Z]/, { message: messages.passwordNeedsUppercase })
        .regex(/[0-9]/, { message: messages.passwordNeedsNumber })
        .nonempty({ message: messages.passwordRequired }),
      confirmPassword: z
        .string()
        .min(8, { message: messages.passwordTooShort })
        .nonempty({ message: messages.passwordRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsDontMatch,
      path: ["confirmPassword"],
    });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * The function onSubmit handles resetting a user's password securely and provides appropriate error
   * messages based on different scenarios.
   * @param {FormData} data - The `onSubmit` function you provided is an asynchronous function that
   * handles form submission for resetting a user's password. It performs the following steps:
   * @returns The `onSubmit` function is returning different error messages based on the specific error
   * that occurs during the password update process. If certain conditions are met, such as an expired
   * session, a password already in use, hitting a rate limit, or encountering an unexpected error, the
   * function sets the appropriate error message using the `setError` function. If the password update is
   * successful, the function sets `isSuccess
   */
  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      // Check if the user has an active session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(messages.sessionExpired);
        router.push("/auth/sign-in");
        return;
      }

      /**
       * The `onSubmit` function is an asynchronous function that updates a user's password using the
       * Supabase authentication service. It performs the following steps:
       *
       * 1. Checks if the user has an active session.
       * 2. Updates the user's password using the `supabase.auth.updateUser` method.
       * 3. Handles different error scenarios, such as missing session, password already in use, rate
       *    limit exceeded, or unexpected errors.
       * 4. Resets the form fields after a successful password update.
       * 5. Pushes the user to the success page after a successful password update.
       */
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        if (updateError.message.includes("Auth session missing")) {
          setError(messages.sessionExpired);
          return;
        }

        if (updateError.message.includes("should be different")) {
          setError(messages.passwordInUse);
          return;
        }

        if (updateError.message.includes("Rate limit")) {
          setError(messages.tooManyAttempts);
          return;
        }

        setError(messages.unexpectedError);
        return;
      }

      // Success
      setIsSuccess(true);
      form.reset();

      // Push to success page
      router.push("/auth/reset-password/success");
    } catch {
      setError(messages.unexpectedError);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6">
        <Alert
          variant="success"
          className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
        >
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">
            {messages.success}
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            {messages.successMessage}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert
          variant="destructive"
          className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        >
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">
            {messages.error}
          </AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            {error}
          </AlertDescription>
        </Alert>
        <Button
          type="button"
          className="w-full"
          onClick={() => router.push("/auth/sign-in")}
        >
          {messages.backToSignIn}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  {messages.newPassword}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={messages.enterNewPassword}
                      className="pr-10 h-11 border-2 focus:border-blue-500 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
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
                <FormMessage className="text-sm font-medium text-red-500" />
              </FormItem>
            )}
          />

          <PasswordStrength
            password={form.watch("password")}
            requirements={[
              {
                text: messages.passwordRequirements,
                validator: (password) => password.length >= 8,
              },
              {
                text: messages.passwordNeedsLowercase,
                validator: (password) => /[a-z]/.test(password),
              },
              {
                text: messages.passwordNeedsUppercase,
                validator: (password) => /[A-Z]/.test(password),
              },
              {
                text: messages.passwordNeedsNumber,
                validator: (password) => /[0-9]/.test(password),
              },
            ]}
            strengthText={{
              weak: messages.passwordStrength.weak,
              medium: messages.passwordStrength.medium,
              strong: messages.passwordStrength.strong,
            }}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold text-gray-700 dark:text-gray-300">
                  {messages.confirmPassword}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={messages.confirmNewPassword}
                      className="pr-10 h-11 border-2 focus:border-blue-500 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
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
                <FormMessage className="text-sm font-medium text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:shadow-blue-500/25"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{messages.submit}</span>
            </div>
          ) : (
            messages.submit
          )}
        </Button>
      </form>
    </Form>
  );
}
