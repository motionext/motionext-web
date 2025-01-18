"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createBrowserClient } from "@supabase/ssr";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PasswordStrength } from "@/components/ui/password-strength";
import { Eye, EyeOff } from "lucide-react";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordFormProps {
  messages: Messages["auth"]["resetPassword"];
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function ResetPasswordForm({ messages }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      setToken(accessToken);

      if (accessToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get("refresh_token") || "",
        });
      }
    }
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true);

      // // Check rate limit before proceeding
      // const response = await fetch("/api/get-client-ip").then((res) =>
      //   res.json()
      // );
      // const identifier = response.ip;
      // const rateLimitCheck = await fetch("/api/check-rate-limit", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ identifier }),
      // }).then((res) => res.json());

      // // Add delay to prevent brute force attacks
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // if (!rateLimitCheck.success) {
      //   const minutes = Math.ceil(rateLimitCheck.reset / 60);
      //   router.push(`/${locale}/rate-limit?minutes=${minutes}`);
      //   return;
      // }

      if (!token) {
        toast.error(messages.invalidToken);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        console.error("Password reset error:", error);

        if (error.message.includes("AuthWeakPasswordError")) {
          toast.error(messages.passwordTooWeak);
        } else if (error.message.includes("token")) {
          toast.error(messages.expiredLink);
        } else if (error.message.includes("Auth session missing")) {
          toast.error(messages.sessionExpired);
        } else if (error.message.includes("should be different")) {
          toast.error(messages.passwordInUse);
        } else {
          toast.error(messages.unexpectedError);
        }
        return;
      }

      // Clear sensitive data and session
      await supabase.auth.signOut();
      router.push("/reset-password/success");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error(messages.unexpectedError);
    } finally {
      setIsLoading(false);
    }
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
