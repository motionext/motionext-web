"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

interface GitHubButtonProps {
  repoUrl: string;
}

export default function GitHubButton({ repoUrl }: GitHubButtonProps) {
  return (
    <Button variant="outline" className="flex items-center gap-2 group" asChild>
      <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
        <Github className="h-4 w-4 group-hover:text-blue-500 transition-colors" />
        <span className="group-hover:text-blue-500 transition-colors">
          GitHub
        </span>
      </Link>
    </Button>
  );
}
