"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import { MoonIcon, SunIcon, MonitorIcon, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  noLinks?: boolean;
  noLanguageSelector?: boolean;
}

export function Navbar({
  messages,
  noLinks = false,
  noLanguageSelector = false,
}: NavbarProps) {
  const { theme, systemTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logoSrc =
    mounted && currentTheme === "dark" ? "/white1.png" : "/black1.png";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container flex items-center justify-between mx-auto px-6">
        <Link href="/" className="flex items-center space-x-3 group">
          {mounted ? (
            <Image
              src={logoSrc}
              alt="Motionext Logo"
              width={100}
              height={100}
              className="h-8 w-auto transition-all duration-300 group-hover:scale-110"
              priority
            />
          ) : (
            <Skeleton className="h-10 w-10 rounded-full" />
          )}
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            Motionext
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {!noLinks && (
            <>
              <NavLink href="/" label={messages.home} />
              <NavLink href="#features" label={messages.features} />
              <NavLink href="#team" label={messages.team} />
              <NavLink
                href="https://docs.motionext.app"
                label={messages.docs}
              />
            </>
          )}
          <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <ThemeToggle messages={messages} />
            {!noLanguageSelector && (
              <LanguageToggle pathname={pathname} />
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center space-x-3">
          <ThemeToggle messages={messages} />
          {!noLanguageSelector && (
            <LanguageToggle pathname={pathname} />
          )}
          {!noLinks && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] border-l border-gray-200 dark:border-gray-800"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-6 mt-10">
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
      className="relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
    >
      <span className="relative">
        {label}
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 transition-transform duration-200 origin-left hover:scale-x-100" />
      </span>
    </Link>
  );
}

function ThemeToggle({ messages }: Pick<NavbarProps, "messages">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36 rounded-xl border border-gray-200 dark:border-gray-800"
      >
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
      className="flex items-center space-x-2 px-2 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-150"
    >
      <span className="text-gray-600 dark:text-gray-400">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </DropdownMenuItem>
  );
}

function LanguageToggle({ pathname }: { pathname: string }) {
  const changeLanguage = (newLocale: string) => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const basePath = url.pathname.replace(/^\/[^\/]+/, "");
    const newPath = `/${newLocale}${basePath}`;
    url.pathname = newPath;
    window.location.href = url.toString();
  };

  const getCurrentLanguage = () => {
    if (pathname.startsWith("/es")) return "ES";
    if (pathname.startsWith("/fr")) return "FR";
    if (pathname.startsWith("/pt")) return "PT";
    return "EN";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full px-3 h-9 text-sm font-medium"
        >
          {getCurrentLanguage()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-36 rounded-xl border border-gray-200 dark:border-gray-800">
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
        <LanguageMenuItem
          countryCode="ES"
          label="Español"
          locale="es"
          changeLanguage={changeLanguage}
        />
        <LanguageMenuItem
          countryCode="FR"
          label="Français"
          locale="fr"
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
      className="flex items-center space-x-2 px-2 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-150"
    >
      <ReactCountryFlag className="text-base" countryCode={countryCode} svg />
      <span className="text-sm font-medium">{label}</span>
    </DropdownMenuItem>
  );
}
