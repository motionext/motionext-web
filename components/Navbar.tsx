"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";
import {
  MoonIcon,
  SunIcon,
  MonitorIcon,
  Menu,
  LogOut,
  TicketIcon,
  Settings,
  User,
  ChevronDown,
  HelpCircleIcon,
  HomeIcon,
  BookOpenIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

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
import { Messages } from "@/types/messages";
import { cx } from "class-variance-authority";

interface NavbarProps {
  messages: Messages["home"];
  noLinks?: boolean;
  noLanguageSelector?: boolean;
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
}

/**
 * The `Navbar` function in TypeScript React is a component that handles navigation, user
 * authentication, and user profile display with dynamic content based on user session status.
 */
export function Navbar({
  messages,
  noLinks = false,
  noLanguageSelector = false,
}: NavbarProps) {
  const { theme, systemTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Check auth status
    const supabase = createClient();
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        // If the user exists, we check the session to get the necessary tokens
        if (user) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          setSession(session);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  // Hook separated to load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!error && user) {
          const { data: userData } = await supabase
            .from("users")
            .select("profile_image")
            .eq("id", user.id)
            .single();

          if (userData) {
            setImageUrl(userData.profile_image);
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    if (session) {
      loadUserData();
    }
  }, [session]);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const logoSrc =
    mounted && currentTheme === "dark" ? "/white1.png" : "/black1.png";

  /**
   * The function `handleSignOut` signs the user out, displays a success message, and redirects to the
   * home page.
   */
  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success(messages.signOutSuccess);
      router.push("/");
    } catch {
      toast.error(messages.signOutError);
    }
  }

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
          <span className="text-2xl font-bold text-gray-900 dark:text-white hidden md:block">
            Motionext
          </span>
        </Link>

        <div className="hidden xl:flex items-center space-x-8">
          {!noLinks && (
            <>
              <NavLink href="/" icon={<HomeIcon />} />
              <NavLink href="/support" icon={<HelpCircleIcon />} />
              <NavLink
                href="https://docs.motionext.app"
                icon={<BookOpenIcon />}
              />
            </>
          )}
          <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
            <ThemeToggle messages={messages} />
            {!noLanguageSelector && <LanguageToggle pathname={pathname} />}
            {!isLoading &&
              (session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {imageUrl ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt="Perfil"
                            width={24}
                            height={24}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {messages.account}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-4 pt-2 text-md font-bold text-gray-900 dark:text-white">
                      {messages.loggedInWith}
                    </div>
                    <div className="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">
                      {session.user.email}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                    <DropdownMenuItem asChild>
                      <Link href={`/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        {messages.settings}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tickets">
                        <TicketIcon className="mr-2 h-4 w-4" />
                        {messages.myTickets}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{messages.signOut}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href="/auth/sign-in">{messages.signIn}</Link>
                </Button>
              ))}
          </div>
        </div>

        <div className="flex xl:hidden items-center space-x-3">
          {!isLoading &&
            (session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {imageUrl ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt="Perfil"
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    {messages.account}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-4 pt-2 text-md font-bold text-gray-900 dark:text-white">
                    {messages.loggedInWith}
                  </div>
                  <div className="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">
                    {session.user.email}
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <DropdownMenuItem asChild>
                    <Link href={`/settings`}>
                      <Settings className="mr-2 h-4 w-4" />
                      {messages.settings}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tickets">
                      <TicketIcon className="mr-2 h-4 w-4" />
                      {messages.myTickets}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{messages.signOut}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/auth/sign-in">{messages.signIn}</Link>
              </Button>
            ))}

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
                {!noLinks && (
                  <>
                    <NavLink
                      href="/"
                      icon={<HomeIcon />}
                      label={messages.home}
                      onClick={() => setIsOpen(false)}
                    />
                    <NavLink
                      href="/support"
                      icon={<HelpCircleIcon />}
                      label={messages.support}
                      onClick={() => setIsOpen(false)}
                    />
                    <NavLink
                      href="https://docs.motionext.app"
                      icon={<BookOpenIcon />}
                      label={messages.docs}
                      onClick={() => setIsOpen(false)}
                    />
                  </>
                )}

                <div
                  className={cx(
                    "border-gray-200 dark:border-gray-700",
                    noLinks ? "pt-0 mt-0" : "pt-6 mt-10 border-t",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="inline-block">
                      <ThemeToggle messages={messages} />
                    </div>

                    {!noLanguageSelector && (
                      <div className="inline-block">
                        <LanguageToggle pathname={pathname} />
                      </div>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

/**
 * The NavLink function in TypeScript React renders a styled link component with an icon, label, and
 * hover effect.
 * @param {NavLinkProps}  - - `href`: The URL to navigate to when the link is clicked.
 * @returns The `NavLink` function is returning a JSX element that represents a clickable link with
 * specified properties such as `href`, `icon`, `label`, and `onClick`. The link has a specific styling
 * defined by the classNames provided, and it includes an icon, label (if provided), and a gradient
 * underline effect that appears on hover.
 */
function NavLink({ href, icon, label, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
    >
      <span className="relative flex items-center gap-2">
        <span className="flex-shrink-0">{icon}</span>
        {label && <span className="font-medium">{label}</span>}
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 transition-transform duration-200 origin-left group-hover:scale-x-100 hover:scale-x-100" />
      </span>
    </Link>
  );
}

/**
 * The `ThemeToggle` function renders a dropdown menu with options to toggle between light, dark, and
 * system themes.
 * @param  - The `ThemeToggle` component is a dropdown menu that allows users to toggle between
 * different themes - light, dark, and system. It consists of a button with icons for the sun and moon
 * to represent light and dark themes, and a dropdown menu with options to select different themes.
 * @returns The `ThemeToggle` function is returning a dropdown menu component that allows the user to
 * toggle between different themes (light, dark, system). The dropdown menu contains a button with
 * icons for the sun and moon to represent light and dark themes respectively. The dropdown menu also
 * includes menu items for selecting the light, dark, or system theme, each with corresponding icons
 * and labels provided through the `messages` prop
 */
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

/**
 * The `ThemeMenuItem` function is a React component that renders a dropdown menu item with an icon,
 * theme, and label, allowing users to change the theme when clicked.
 * @param  - The `ThemeMenuItem` component takes in three props:
 * @returns The `ThemeMenuItem` component is being returned. It is a functional component that renders
 * a `DropdownMenuItem` with an icon, label, and onClick functionality to set the theme using the
 * `setTheme` function from the `useTheme` hook. The component has a specific styling for hover effects
 * and rounded corners.
 */

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
    // Definir cookie NEXT_LOCALE com 1 ano de validade
    document.cookie = `NEXT_LOCALE=${newLocale}; max-age=31536000; path=/`;

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

/**
 * The `LanguageMenuItem` component renders a menu item for selecting a language.
 * It displays a country flag and the language label, and triggers a language change
 * when clicked.
 *
 * @param {Object} props - The properties for the component.
 * @param {string} props.countryCode - The ISO 3166-1 alpha-2 code of the country.
 * @param {string} props.label - The display label for the language.
 * @param {string} props.locale - The locale code to be used for language change.
 * @param {function} props.changeLanguage - The function to call when the language is changed.
 *
 * @returns The rendered language menu item.
 */
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
