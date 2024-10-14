"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/30 dark:border-blue-400/30 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20 transition-all duration-300">
        <CardHeader className="relative pb-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 dark:bg-blue-400/10 rounded-bl-full"></div>
          <div className="text-5xl mb-6">{icon}</div>
          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 text-transparent bg-clip-text">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <CardDescription className="text-gray-800 dark:text-gray-200 leading-relaxed antialiased">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
