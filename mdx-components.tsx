import { MDXComponents } from "mdx/types";

/**
 * The `normalize` function takes a string input, converts it to lowercase, removes non-word
 * characters, replaces spaces and certain characters with hyphens, and ensures only single hyphens are
 * used consecutively.
 * @param {string} text - The `normalize` function takes a `text` input as a parameter and normalizes
 * it by converting it to lowercase, removing leading and trailing whitespaces, replacing non-word
 * characters with hyphens, replacing spaces with hyphens, replacing '&' with 'and', removing all
 * non-word characters except hy
 * @returns The `normalize` function takes a string as input, normalizes it by converting it to
 * lowercase, removing leading and trailing whitespaces, replacing non-word characters with "-",
 * replacing spaces with "-", replacing "&" with "and", removing all non-word characters except for
 * "-", and replacing multiple "-" with a single "-". The normalized string is then returned.
 */
function normalize(text: string) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace all non-word chars with -
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

/* This `export function useMDXComponents(components: MDXComponents)` function is a utility function
that takes an object of MDX components as input and returns a modified version of that object with
additional functionality. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props: any) => <h1 {...props} id={normalize(props.children)} />,
    h2: (props: any) => <h2 {...props} id={normalize(props.children)} />,
    h3: (props: any) => <h3 {...props} id={normalize(props.children)} />,
    h4: (props: any) => <h4 {...props} id={normalize(props.children)} />,
    h5: (props: any) => <h5 {...props} id={normalize(props.children)} />,
  };
}
