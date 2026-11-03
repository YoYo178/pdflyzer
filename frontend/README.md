# PDFLyzer Frontend

The web client for **PDFLyzer**, an AI-powered PDF assistant that lets users upload documents, manage conversations, and interact with their PDFs through an intuitive chat interface.

Built with **React**, **TypeScript**, and **Vite**, the frontend provides a responsive interface for document management and AI-powered conversations.

## Features

- **Document Management** – Upload and manage PDF documents.
- **AI-Powered Chat** – Interact with uploaded documents through conversational AI.
- **Streaming Responses** – Receive AI-generated responses in real time.
- **Conversation Management** – Create and manage conversations around your documents.
- **Authentication** – User registration, login, and session management.
- **Markdown Rendering** – Render formatted AI responses with support for GitHub Flavored Markdown.
- **Source References** – Explore document references associated with AI-generated responses.
- **Responsive UI** – An intuitive interface designed for different screen sizes.

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vite.dev/) | Build tool and development server |
| [React Router](https://reactrouter.com/) | Client-side routing |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Base UI](https://base-ui.com/) | Accessible UI primitives |
| [shadcn/ui](https://ui.shadcn.com/) | UI component tooling |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [Axios](https://axios-http.com/) | HTTP client |
| [React Hook Form](https://react-hook-form.com/) | Form management |
| [Valibot](https://valibot.dev/) | Schema validation |
| [Motion](https://motion.dev/) | Animations |
| [Tabler Icons](https://tabler.io/icons) | Icon library |
| [React Markdown](https://github.com/remarkjs/react-markdown) | Markdown rendering |
| [pnpm](https://pnpm.io/) | Package management |

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm 12+
- A running PDFLyzer backend instance

### Installation

Clone the repository:

```bash
git clone https://github.com/YoYo178/pdflyzer.git
cd pdflyzer/frontend
```

Install dependencies:

```bash
pnpm install
```

### Environment Configuration

Create a `.env` file or re-use the existing `.env.example` in the project root and configure the backend API URL.

```env
VITE_SERVER_API_URL=http://localhost:8000
```

Make sure the environment variable matches the one used by your application.

### Running the Development Server

```bash
pnpm dev
```

The development server will be available at:

```text
http://localhost:5173
```

### Production Build

Build the application:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

The generated production assets will be available in the `dist/` directory.

## Development

### Linting

Run Oxlint:

```bash
pnpm lint
```

### Type Checking

Run TypeScript's project build checks:

```bash
pnpm exec tsc -b
```

## Project Structure

The frontend follows a feature-oriented structure, separating application-level configuration, reusable components, and feature-specific functionality.

```text
frontend/
├── public/             # Static assets
├── src/
│   ├── assets/         # Application assets
│   ├── components/     # Reusable UI components
│   ├── features/       # Feature-specific modules
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Shared utilities and configurations
│   ├── routes/         # Application routes
│   ├── services/       # API integrations
│   ├── types/          # Shared TypeScript types
│   └── ...
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── vite.config.ts
```

*Adjust the structure above to match the actual repository layout.*

## Related Projects

PDFLyzer consists of separate frontend and backend applications.

- **Frontend:** (You're here!).
- **Backend:** [PDFLyzer Backend](https://github.com/YoYo178/pdflyzer/tree/main/backend)
