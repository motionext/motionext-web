import { getRequestConfig } from "next-intl/server";

/* This code snippet is exporting a default function that uses the `getRequestConfig` function from the
"next-intl/server" library. The function is defined as an asynchronous arrow function that takes a
parameter `locale`. Inside the function, it dynamically imports the translations for the specified
`locale` from the corresponding file in the "messages" directory using the `import` function. The
imported translations are then accessed and returned as the `messages` property in the object. */
export default getRequestConfig(async ({ locale }) => ({
  locale,
  messages: (await import(`./messages/${locale}`)).translations,
}));
