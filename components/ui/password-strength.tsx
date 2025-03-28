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

/**
 * The `PasswordStrength` function calculates and visually represents the strength of a password based
 * on specified requirements.
 * @param {string} password - It looks like you were about to provide the parameters for the
 * `PasswordStrength` component. Please go ahead and provide the necessary information for the
 * `password`, `requirements`, and `strengthText` parameters so that I can assist you further with the
 * `PasswordStrength` component.
 * @returns The `PasswordStrength` component is being returned. It calculates the strength of a
 * password based on certain requirements and displays a visual representation of the password strength
 * along with individual requirement checks.
 */
export function PasswordStrength({
  password,
  requirements,
  strengthText,
}: PasswordStrengthProps) {
  /**
   * The function `getPasswordStrength` calculates the strength of a password based on a set of
   * requirements.
   * @param {string} password - It looks like you are trying to calculate the strength of a password
   * based on certain requirements. However, it seems that the `requirements` array is not defined in the
   * provided code snippet. You will need to define the `requirements` array and its elements before
   * using it in the `getPasswordStrength`
   * @returns The function `getPasswordStrength` returns a number representing the strength of the
   * password based on the percentage of valid requirements it meets.
   */
  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    const validRequirements = requirements.filter((req) =>
      req.validator(password)
    ).length;
    return (validRequirements / requirements.length) * 100;
  };

  const strength = getPasswordStrength(password);

  /**
   * The function `getStrengthColor` returns a color gradient class based on the strength value provided.
   * @param {number} strength - The `strength` parameter in the `getStrengthColor` function represents a
   * number that indicates the strength level. The function returns a specific color range based on the
   * strength level provided:
   * @returns The `getStrengthColor` function returns a string representing a color gradient based on the
   * strength value provided as an argument. If the strength is less than 50, it returns "from-red-500
   * to-red-600", if the strength is less than 100, it returns "from-yellow-500 to-yellow-600", and if
   * the strength is 100 or greater, it returns "from
   */
  const getStrengthColor = (strength: number) => {
    if (strength < 50) return "from-red-500 to-red-600";
    if (strength < 100) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };
  /**
   * The function `getStrengthText` takes a number representing strength and returns a corresponding text
   * label based on predefined thresholds.
   * @param {number} strength - The `getStrengthText` function takes a parameter `strength`, which is a
   * number representing the strength value. The function then returns a corresponding strength text
   * based on the value of `strength`. If `strength` is less than 50, it returns the text `weak`, if it
   * is less than
   * @returns The `getStrengthText` function is returning a text value based on the strength parameter
   * provided. If the strength is less than 50, it returns the text value `strengthText.weak`. If the
   * strength is less than 100 but greater than or equal to 50, it returns the text value
   * `strengthText.medium`. Otherwise, if the strength is 100 or greater, it returns the
   */
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
