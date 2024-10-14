import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { translations } from "@/messages/en";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar messages={translations.Home} noLanguageSelector />
      <div className="prose mx-auto max-w-full sm:max-w-4xl flex-1 p-2 sm:p-6 pt-[5.5rem] text-black dark:text-white prose-code:before:content-none prose-code:after:content-none dark:prose-headings:text-white dark:prose-a:text-white dark:prose-strong:text-white prose-headings:text-black prose-a:text-black prose-strong:text-black break-words">
        <div className="overflow-x-auto -mx-2 sm:-mx-6 px-2 sm:px-6">
          {children}
        </div>
      </div>
      <Footer
        copyright={translations.Home.copyright}
        contactUs={translations.Home.contactUs}
        terms={translations.Home.terms}
        policy={translations.Home.policy}
        eula={translations.Home.eula}
      />
    </>
  );
}
