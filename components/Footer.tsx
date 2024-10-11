import { ContactButton } from "@/components/ContactButton";

interface FooterProps {
  copyright: string;
  contactUs: string;
}

export function Footer({ copyright, contactUs }: FooterProps) {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 py-6">
      <div className="container mx-auto text-center">
        <p>{copyright}</p>
        <ContactButton contactUs={contactUs} />
      </div>
    </footer>
  );
}
