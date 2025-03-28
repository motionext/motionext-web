"use client";

import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import Link from "next/link";

interface InstagramButtonProps {
  profileUrl: string;
}

/**
 * This function renders an Instagram button with a link to a specified profile URL.
 * @param {InstagramButtonProps}  - The `InstagramButton` component takes a single prop `profileUrl`,
 * which is the URL of the Instagram profile that the button will link to. The component renders a
 * button with the Instagram icon and text "Instagram", which when clicked will open the Instagram
 * profile in a new tab.
 * @returns The `InstagramButton` component is being returned. It is a button component that, when
 * clicked, opens the Instagram profile specified by the `profileUrl` prop in a new tab. The button
 * displays the Instagram logo and the text "Instagram".
 */
export default function InstagramButton({ profileUrl }: InstagramButtonProps) {
  return (
    <Button variant="outline" className="flex items-center gap-2 group" asChild>
      <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
        <Instagram className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
        <span className="group-hover:text-blue-500 transition-colors">
          Instagram
        </span>
      </Link>
    </Button>
  );
}
