# PDFLyzer

**Chat with your PDFs. Get answers grounded in your documents.**

PDFLyzer is an AI-powered document intelligence application that lets you upload PDF documents and interact with their contents through context-aware conversations.

Powered by Retrieval-Augmented Generation (RAG), PDFLyzer retrieves relevant information from your documents to generate meaningful, context-grounded responses with source references.

## Features

- **Document Upload** – Upload and manage PDF documents.
- **AI-Powered Conversations** – Ask questions and interact with your documents using natural language.
- **Semantic Search** – Retrieve relevant document content based on meaning rather than exact keyword matches.
- **Context-Grounded Responses** – Generate answers using retrieved document context.
- **Source References** – Trace AI-generated responses back to their relevant document sources.
- **Streaming Responses** – Receive generated responses in real time.
- **Asynchronous Processing** – Process documents in the background without blocking the application.

## Project Structure

PDFLyzer is organized into two independent applications:

```text
PDFLyzer/
├── frontend/       # React + TypeScript + Vite
│   └── README.md
│
├── backend/        # Python + FastAPI
│   └── README.md
│
└── README.md
```

## Getting Started

To get started, navigate to the respective application directory and follow its setup instructions.

| Component | Description | Documentation |
|---|---|---|
| Frontend | Web application built with React, TypeScript, and Vite. | [Frontend README](./frontend/README.md) |
| Backend | REST API and background processing powered by FastAPI. | [Backend README](./backend/README.md) |

### Prerequisites

- Node.js and pnpm
- Python 3.14+ and uv
- MongoDB
- Redis
- Google Gemini API key

Refer to the individual application READMEs for installation, environment configuration, and development instructions.

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query

**Backend**
- Python
- FastAPI
- MongoDB and Beanie
- Redis and ARQ
- Sentence Transformers
- Google Gemini
- PyMuPDF
