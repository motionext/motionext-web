import { ContactButton } from "@/components/ContactButton";
import { Github, Instagram } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  copyright: string;
  contactUs: string;
  terms: string;
  policy: string;
  eula: string;
}

export function Footer({
  copyright,
  contactUs,
  terms,
  policy,
  eula,
}: FooterProps) {
  return (
    <footer className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Motionext
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {copyright}
            </p>
            <div className="mt-2 space-x-3">
              <a
                href="/legal/tos"
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                {terms}
              </a>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                •
              </span>
              <a
                href="/legal/privacy"
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                {policy}
              </a>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                •
              </span>
              <a
                href="/legal/eula"
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                {eula}
              </a>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-4">
              <Link
                aria-label="Github"
                href="https://github.com/motionext"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <Github size={20} />
              </Link>
              <Link
                aria-label="Instagram"
                href="https://instagram.com/motionext.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
              >
                <Instagram size={20} />
              </Link>
            </div>
            <ContactButton contactUs={contactUs} />
          </div>
        </div>
      </div>
    </footer>
  );
}
