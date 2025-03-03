"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  text: string;
  avatar?: string;
}

export default function TestimonialCard({
  name,
  role,
  text,
  avatar
}: TestimonialCardProps) {
  // Get the initials of the name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4 text-blue-500 dark:text-blue-400">
            <Quote size={32} className="opacity-70" />
          </div>

          <p className="text-gray-700 dark:text-gray-300 italic mb-6 flex-grow">
            &quot;{text}&quot;
          </p>

          <div className="flex items-center mt-auto">
            <Avatar className="h-12 w-12 border-2 border-blue-100 dark:border-blue-900">
              <AvatarImage src={avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="ml-4">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
