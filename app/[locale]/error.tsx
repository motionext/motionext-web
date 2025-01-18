"use client";

import { useEffect, useState } from "react";
import { getMessages } from "@/lib/get-messages";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [messages, setMessages] = useState<any>(null);
  const [locale, setLocale] = useState<string>("en");

  useEffect(() => {
    const path = window.location.pathname;
    const currentLocale = path.split('/')[1];
    setLocale(currentLocale);

    async function loadMessages() {
      const msgs = await getMessages(currentLocale);
      setMessages(msgs);
    }

    loadMessages();
  }, []);

  if (!messages) return null;

  return (
    <>
      <Navbar messages={messages.home} noLinks />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-black p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg">
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 space-y-8 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-full ring-8 ring-white/90 dark:ring-gray-800/90 shadow-lg">
                <AlertOctagon className="h-16 w-16 text-red-500 dark:text-red-400" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 pt-8">
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-200 bg-clip-text text-transparent">
                {messages.errors.errorTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                {messages.errors.errorDescription}
              </p>
              <Button
                onClick={reset}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-8 py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-red-500/25"
              >
                {messages.errors.tryAgain}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
} 