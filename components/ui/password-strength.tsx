"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

interface PasswordRequirement {
  text: string;
  validator: (password: string) => boolean;
}

interface PasswordStrengthProps {
  password: string;
  requirements: PasswordRequirement[];
  strengthText: {
    weak: string;
    medium: string;
    strong: string;
  };
}

export function PasswordStrength({
  password,
  requirements,
  strengthText,
}: PasswordStrengthProps) {
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    const validRequirements = requirements.filter((req) =>
      req.validator(password)
    ).length;
    return (validRequirements / requirements.length) * 100;
  };

  const strength = getPasswordStrength(password);

  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "from-red-500 to-red-600";
    if (strength < 100) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 50) return strengthText.weak;
    if (strength < 100) return strengthText.medium;
    return strengthText.strong;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out bg-gradient-to-r",
              getStrengthColor(strength)
            )}
            style={{ width: `${strength}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p
            className={cn(
              "text-sm font-medium transition-colors",
              strength < 50
                ? "text-red-600 dark:text-red-400"
                : strength < 100
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            )}
          >
            {getStrengthText(strength)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            {requirement.validator(password) ? (
              <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 text-gray-400 dark:text-gray-600" />
            )}
            {requirement.text}
          </div>
        ))}
      </div>
    </div>
  );
} 