"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

interface GitHubButtonProps {
  repoUrl: string;
}

/**
 * This function renders a GitHub button with a link to a specified repository URL.
 * @param {GitHubButtonProps}  - The `GitHubButton` component takes a single prop `repoUrl`, which is a
 * string representing the URL of a GitHub repository. This component renders a button with an outline
 * style that, when clicked, opens the GitHub repository URL in a new tab. The button contains an icon
 * of the GitHub logo and
 * @returns The `GitHubButton` component is being returned. It is a functional component that renders a
 * button with a GitHub icon and text "GitHub". The button is a link to the `repoUrl` provided as a
 * prop, and it opens in a new tab with the `rel="noopener noreferrer"` attribute for security.
 */
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
