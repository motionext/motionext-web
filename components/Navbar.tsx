"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

interface NavbarProps {
  messages: {
    home: string;
    features: string;
    team: string;
    light: string;
    dark: string;
    system: string;
  };
}

export function Navbar({ messages }: NavbarProps) {
  const { theme, systemTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const logoSrc =
    mounted && currentTheme === "dark" ? "/white1.png" : "/black1.png";

  return (
    <nav className="w-full bg-gray-50 dark:bg-gray-800 py-4 transition-colors duration-300">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-4">
          {mounted && (
            <Image
              src={logoSrc}
              alt="Motionext Logo"
              width={30}
              height={30}
              className="h-8 w-auto xl:px-2 ms-6 md:ms-0"
            />
          )}
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Motionext
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <NavLink href="/" label={messages.home} />
          <NavLink href="#features" label={messages.features} />
          <NavLink href="#team" label={messages.team} />
          <ThemeToggle messages={messages} />
          <LanguageToggle pathname={pathname} router={router} />
        </div>
        <div className="flex md:hidden space-x-3 items-center me-6 md:me-0">
          <ThemeToggle messages={messages} />
          <LanguageToggle pathname={pathname} router={router} />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <span className="sr-only">Open menu</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4">
              <nav className="flex flex-col space-y-4">
                <NavLink href="/" label={messages.home} onClick={() => setIsOpen(false)} />
                <NavLink href="#features" label={messages.features} onClick={() => setIsOpen(false)} />
                <NavLink href="#team" label={messages.team} onClick={() => setIsOpen(false)} />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
}

function NavLink({ href, label, onClick }: NavLinkProps) {
  return (
    <Link
      key={`toc-${label}`}
      href={href}
      onClick={onClick}
      className="px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
    >
      {label}
    </Link>
  );
}

function ThemeToggle({ messages }: Pick<NavbarProps, "messages">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ThemeMenuItem
          icon={<SunIcon />}
          theme="light"
          label={messages.light}
        />
        <ThemeMenuItem icon={<MoonIcon />} theme="dark" label={messages.dark} />
        <ThemeMenuItem
          icon={<MonitorIcon />}
          theme="system"
          label={messages.system}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeMenuItem({
  icon,
  theme,
  label,
}: {
  icon: React.ReactNode;
  theme: string;
  label: string;
}) {
  const { setTheme } = useTheme();
  return (
    <DropdownMenuItem onClick={() => setTheme(theme)}>
      <span className="mx-2">{icon}</span>
      {label}
    </DropdownMenuItem>
  );
}

function LanguageToggle({
  pathname,
  router,
}: {
  pathname: string;
  router: ReturnType<typeof useRouter>;
}) {
  const changeLanguage = (newLocale: string) => {
    window.location.href = `/${newLocale}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {pathname.startsWith("/en") ? "EN" : "PT"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <LanguageMenuItem
          countryCode="US"
          label="English"
          locale="en"
          changeLanguage={changeLanguage}
        />
        <LanguageMenuItem
          countryCode="PT"
          label="Português"
          locale="pt"
          changeLanguage={changeLanguage}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageMenuItem({
  countryCode,
  label,
  locale,
  changeLanguage,
}: {
  countryCode: string;
  label: string;
  locale: string;
  changeLanguage: (locale: string) => void;
}) {
  return (
    <DropdownMenuItem onClick={() => changeLanguage(locale)}>
      <ReactCountryFlag
        className="h-[1.2rem] w-[1.2rem] mr-2"
        countryCode={countryCode}
        svg
      />
      {label}
    </DropdownMenuItem>
  );
}
