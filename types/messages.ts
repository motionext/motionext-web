import messagesEn from "@/messages/en";

// Type to convert literal values to string
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? DeepStringify<T[K]>
    : T[K] extends string
      ? string
      : T[K];
};

// Remove the 'as const' to get the correct type
type MessagesType = typeof messagesEn;

// Export the Messages type with all strings
export type Messages = DeepStringify<MessagesType>;
