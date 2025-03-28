"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useInView } from "framer-motion";

interface StatsCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

/**
 * The `StatsCard` component displays an animated numeric value with optional prefix/suffix in a card layout.
 * The value animates from 0 to the target number when the card comes into view.
 *
 * @param {StatsCardProps} props - The properties for the component
 * @param {number} props.value - The target numeric value to count up to
 * @param {string} props.label - The descriptive text label shown below the value
 * @param {string} [props.suffix=""] - Optional suffix to append after the number (e.g. "%")
 * @param {string} [props.prefix=""] - Optional prefix to prepend before the number (e.g. "$")
 * @param {number} [props.duration=2000] - Animation duration in milliseconds
 *
 * @returns A card component that displays an animated counting number with label
 */
export default function StatsCard({
  value,
  label,
  suffix = "",
  prefix = "",
  duration = 2000,
}: StatsCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const incrementTime = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => {
      clearInterval(timer);
    };
  }, [isInView, value, duration]);

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div
          ref={ref}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text mb-2"
        >
          {prefix}
          {count.toLocaleString()}
          {suffix}
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">{label}</p>
      </CardContent>
    </Card>
  );
}
