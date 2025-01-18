import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getMessages } from "@/lib/get-messages";
import { ThemeProvider } from "@/components/theme-provider";

export default async function MdxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages("en");

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar messages={messages.home} noLinks noLanguageSelector />
      <div className="prose mx-auto max-w-4xl flex-1 p-6 pt-[5.5rem] text-black dark:text-white prose-code:before:content-none prose-code:after:content-none dark:prose-headings:text-white dark:prose-a:text-white dark:prose-strong:text-white prose-headings:text-black prose-a:text-black prose-strong:text-black break-words">
        {children}
      </div>
      <Footer messages={messages} />
    </ThemeProvider>
  );
}
