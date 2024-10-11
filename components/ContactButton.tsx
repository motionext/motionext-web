"use client";

import { Button } from "@/components/ui/button";
import { ThemeInitializer } from "@/components/ThemeInitializer";

interface ContactButtonProps {
  contactUs: string;
}

export function ContactButton({ contactUs }: ContactButtonProps) {
  const handleClick = () => {
    window.location.href = "mailto:info@motionext.app";
  };

  return (
    <>
      <ThemeInitializer />
      <Button
        variant="link"
        className="text-black dark:text-white hover:text-gray-600 dark:hover:text-blue-200 mt-2"
        onClick={handleClick}
      >
        ⮕ {contactUs}
      </Button>
    </>
  );
}
