"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

/**
 * The function `FaqAccordion` renders a list of FAQ items in an accordion format using React
 * components.
 * @param {FaqAccordionProps}  - The `FaqAccordion` function is a React component that renders an
 * accordion component with a list of FAQ items. The component takes a prop `items` which is an array
 * of objects containing `question` and `answer` properties for each FAQ item.
 * @returns The `FaqAccordion` function is being exported as the default export. It takes a prop
 * `items` of type `FaqAccordionProps`. Inside the function, it renders an `Accordion` component with
 * type "multiple" and a class name of "w-full".
 */
export default function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border border-gray-200/50 dark:border-gray-700/50 rounded-lg mb-4 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
        >
          <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
