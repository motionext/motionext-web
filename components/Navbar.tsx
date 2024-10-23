"use client";

import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { MoonIcon, SunIcon, MonitorIcon, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

interface NavbarProps {
  messages: {
    home: string;
    features: string;
    team: string;
    light: string;
    dark: string;
    system: string;
    docs: string;
  };
  noLanguageSelector?: boolean;
}

export function Navbar({ messages, noLanguageSelector = false }: NavbarProps) {
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
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 shadow-md transition-all duration-300">
      <div className="container flex items-center justify-between mx-auto px-4">
        <a href="/" className="flex items-center space-x-4">
          {mounted ? (
            <Image
              src={logoSrc}
              alt="Motionext Logo"
              width={100}
              height={100}
              className="h-8 w-auto transition-all duration-200 hover:scale-110"
            />
          ) : (
            <Skeleton className="h-10 w-10 rounded-full" />
          )}
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Motionext
          </span>
        </a>
        <div className="hidden md:flex items-center space-x-6">
          {!noLanguageSelector && (
            <>
              <NavLink href="/" label={messages.home} />
              <NavLink href="#features" label={messages.features} />
              <NavLink href="#team" label={messages.team} />
              <NavLink href="https://docs.motionext.app" label={messages.docs} />
            </>
          )}
          <ThemeToggle messages={messages} />
          {!noLanguageSelector && (
            <LanguageToggle pathname={pathname} router={router} />
          )}
        </div>
        <div className="flex md:hidden items-center space-x-4">
          <ThemeToggle messages={messages} />
          {!noLanguageSelector && (
            <LanguageToggle pathname={pathname} router={router} />
          )}
          {!noLanguageSelector && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavLink
                    href="/"
                    label={messages.home}
                    onClick={() => setIsOpen(false)}
                  />
                  <NavLink
                    href="#features"
                    label={messages.features}
                    onClick={() => setIsOpen(false)}
                  />
                  <NavLink
                    href="#team"
                    label={messages.team}
                    onClick={() => setIsOpen(false)}
                  />
                  <NavLink
                    href="https://docs.motionext.app"
                    label={messages.docs}
                    onClick={() => setIsOpen(false)}
                  />
                </nav>
              </SheetContent>
            </Sheet>
          )}
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
      href={href}
      onClick={onClick}
      className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 group"
    >
      {label}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
    </Link>
  );
}

function ThemeToggle({ messages }: Pick<NavbarProps, "messages">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
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
    <DropdownMenuItem
      onClick={() => setTheme(theme)}
      className="flex items-center space-x-2 px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span className="text-gray-600 dark:text-gray-400">{icon}</span>
      <span>{label}</span>
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
        <Button variant="outline" className="rounded-full">
          {pathname.startsWith("/en") ? "EN" : "PT"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36">
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
    <DropdownMenuItem
      onClick={() => changeLanguage(locale)}
      className="flex items-center space-x-2 px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <ReactCountryFlag className="text-xl" countryCode={countryCode} svg />
      <span>{label}</span>
    </DropdownMenuItem>
  );
}
