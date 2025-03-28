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

/**
 * The `FeatureCard` function in TypeScript React renders a styled card component with a title,
 * description, and icon that includes interactive hover and tap animations.
 * @param {FeatureCardProps}  - The `FeatureCard` component takes in the following parameters:
 * @returns The `FeatureCard` component is being returned. It is a functional component that renders a
 * card with a title, description, and an icon. The card has hover and tap animations using the
 * `motion` component from Framer Motion library. The styling includes gradients, shadows, and
 * transitions for a visually appealing design.
 */
export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="group overflow-hidden bg-gradient-to-br from-white/90 to-white/50 dark:from-gray-900/90 dark:to-gray-800/50 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500">
        <CardHeader className="relative pb-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/20 dark:to-purple-400/20 rounded-bl-[100px] transform group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {icon}
            </div>
            <CardTitle className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text tracking-tight">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CardDescription className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
