# Motionext Web

## Overview

This project is a modern web application built using Next.js, TypeScript, and Tailwind CSS. It incorporates advanced UI libraries, such as Shadcn UI and Radix UI to deliver a responsive and dynamic user experience. The project is structured to optimize performance and maintainability, adhering to best practices in React and Next.js development.

## Features

- **Responsive Design**: Built with a mobile-first approach using Tailwind CSS.
- **Modern UI Components**: Utilizes Shadcn UI and Radix UI for a consistent and accessible user interface.
- **TypeScript**: Ensures type safety and an improved developer experience.
- **Performance Optimizations**: Includes lazy loading, dynamic imports, and server-side rendering.
- **Custom Theming**: Easily customizable themes using CSS variables and Tailwind's extend functionality.

## Getting Started

### Prerequisites

- Node.js (version 20.17.x)
- pnpm (version 9.11.x)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/yourproject.git
   ```

2. Navigate to the project directory:

   ```bash
   cd yourproject
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the Application

To start the development server, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production, use:

```bash
pnpm build
```

### Linting and Formatting

Ensure code quality with:

```bash
pnpm lint
```

## Configuration

### Tailwind CSS

The `tailwind.config.js` file is configured to support dark mode and custom themes. You can extend the theme by modifying the `extend` section.

### TypeScript

The `tsconfig.json` file is set up to support strict type checking and modern JavaScript features.

### Internationalization

The `messages/i18n-config.ts` file manages the internationalization settings for the application.

### Middleware

The `middleware.ts` file is used for handling custom server-side logic.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://shadcn.dev/)
- [Radix UI](https://radix-ui.com/)

## Redis Rate Limiting

This project uses Cloudflare Rate Limit