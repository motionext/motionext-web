"use client";

import { useEffect, useState } from "react";
import { getMessages } from "@/lib/get-messages";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
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
              <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-full ring-8 ring-white/90 dark:ring-gray-800/90 shadow-lg">
                <FileQuestion className="h-16 w-16 text-purple-500 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-6 pt-8">
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-200 bg-clip-text text-transparent">
                {messages.errors.notFoundTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">
                {messages.errors.notFoundDescription}
              </p>
              <Link href={`/${locale}`}>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/25">
                  {messages.errors.backToHome}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer messages={messages} />
    </>
  );
} 