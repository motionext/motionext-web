"use client";

import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import Link from "next/link";

interface InstagramButtonProps {
  profileUrl: string;
}

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
