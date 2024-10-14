"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeInitializer } from "@/components/ThemeInitializer";
import { MailIcon } from "lucide-react";

interface ContactButtonProps {
  contactUs: string;
}

export function ContactButton({ contactUs }: ContactButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    window.location.href = "mailto:info@motionext.app";
  };

  return (
    <>
      <ThemeInitializer />
      <Button
        variant="outline"
        className={`
          mt-3 items-center gap-2 px-4 py-2 rounded-full
          text-sm font-medium transition-all ease-in-out
          bg-gradient-to-r text-black dark:text-white
          border border-blue-500 hover:border-blue-900
          hover:shadow-lg hover:scale-105
          dark:border-blue-400 dark:hover:border-blue-800
          duration-600
          ${isHovered ? "animate-pulse" : ""}
        `}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MailIcon className="w-4 h-4 text-black dark:text-white" />
        {contactUs}
      </Button>
    </>
  );
}
