import { MDXComponents } from "mdx/types";

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
