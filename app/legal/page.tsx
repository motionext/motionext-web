import { Metadata } from "next";
import LegalCards from "@/components/LegalCards";
import { translations } from "@/messages/en";

export const metadata: Metadata = {
  title: "Legal Information - Motionext",
  description:
    "Access our Terms of Service, Privacy Policy, and End User License Agreement.",
};

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        {translations.Legal.legal}
      </h1>
      <LegalCards />
    </div>
  );
}
