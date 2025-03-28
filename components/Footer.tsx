import type { Messages } from "@/types/messages";
import Link from "next/link";
import { Github, Mail, Instagram, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FooterProps {
  messages: Messages;
}

/**
 * The `Footer` function in TypeScript React renders a footer component with various sections like
 * quick links, legal information, and contact details, along with logos and social media links.
 * @param {FooterProps}  - The `Footer` component is a functional component that renders the footer
 * section of a website. It takes a prop `messages` of type `FooterProps`, which presumably contains
 * messages or text content for the footer.
 * @returns The `Footer` component is being returned. It contains a footer section with various links
 * and information such as company logo, quick links, legal information, contact details, and copyright
 * notice. The footer is styled using Tailwind CSS classes and includes icons for social media links.
 */
export function Footer({ messages }: FooterProps) {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/black1.png"
                alt="Motionext Logo"
                className="h-8 w-auto dark:hidden"
                width={32}
                height={32}
              />
              <Image
                src="/white1.png"
                alt="Motionext Logo"
                className="hidden h-8 w-auto dark:block"
                width={32}
                height={32}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Motionext.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com/motionext" target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://instagram.com/motionext.app" target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {messages.layout.footer.quickLinks}
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
              >
                <span>{messages.home.quickLinks.home}</span>
              </Link>
              <Link
                href="https://docs.motionext.app"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
              >
                <span>{messages.home.quickLinks.docs}</span>
              </Link>
              <Link
                href="https://status.motionext.app"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
              >
                <span>{messages.home.quickLinks.status}</span>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {messages.layout.footer.legal}
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                href="/legal/tos"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>{messages.layout.footer.terms}</span>
              </Link>
              <Link
                href="/legal/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>{messages.layout.footer.policy}</span>
              </Link>
              <Link
                href="/legal/eula"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>{messages.layout.footer.eula}</span>
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {messages.layout.footer.contact}
            </h3>
            <div className="space-y-4">
              <Link
                href="mailto:info@motionext.app"
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>info@motionext.app</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Motionext.{" "}
              {messages.layout.footer.allRightsReserved}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
