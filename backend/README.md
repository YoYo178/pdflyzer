# PDFLyzer Backend

The backend powering **PDFLyzer**, an AI-powered document intelligence application that enables users to interact with their PDF documents through context-aware conversations.

Built with **FastAPI**, **MongoDB**, and **Google Gemini**, PDFLyzer uses Retrieval-Augmented Generation (RAG) to retrieve relevant document context and generate grounded responses to user queries.

## Features

- **Document Processing** – Upload, process, and extract content from PDF documents.
- **Retrieval-Augmented Generation (RAG)** – Generate context-aware responses using relevant document chunks.
- **Semantic Search** – Leverage Sentence Transformers to generate embeddings and retrieve relevant content.
- **AI-Powered Conversations** – Interact with uploaded documents using Google Gemini.
- **Streaming Responses** – Stream AI-generated responses to clients.
- **Asynchronous Processing** – Offload resource-intensive document processing and background tasks to Redis-backed workers.
- **Authentication** – JWT-based authentication with refresh token support.
- **Email Verification** – Asynchronous email delivery for account verification.
- **Document Deduplication** – Use SHA-256 hashing to identify duplicate uploads.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Python](https://www.python.org/) | Primary programming language |
| [FastAPI](https://fastapi.tiangolo.com/) | API framework |
| [MongoDB](https://www.mongodb.com/) | Database |
| [Beanie](https://beanie-odm.dev/) | Asynchronous MongoDB ODM |
| [Redis](https://redis.io/) | Caching and job queue infrastructure |
| [ARQ](https://arq-docs.helpmanual.io/) | Background job processing |
| [Sentence Transformers](https://sbert.net/) | Text embeddings |
| [Google Gemini](https://ai.google.dev/) | LLM integration |
| [PyMuPDF](https://pymupdf.readthedocs.io/) | PDF extraction and processing |
| [Pydantic](https://docs.pydantic.dev/) | Data validation and settings |
| [uv](https://docs.astral.sh/uv/) | Python package and project management |

## Architecture

The backend follows a layered architecture, separating HTTP handling, business logic, data access, and external service integrations.

```text
backend/
├── dependencies/     # Dependency providers and injection
├── models/           # Beanie document models
├── repositories/     # Database access layer
├── routes/           # API route handlers
├── schemas/          # Pydantic request/response schemas
├── services/         # Business logic and integrations
└── ...
```

The application also uses a separate worker process for asynchronous background jobs.

### Document Processing Pipeline

1. A user uploads a PDF document.
2. The backend validates the file and calculates its SHA-256 hash.
3. The document is stored and a background processing job is queued.
4. The worker extracts text and splits it into manageable chunks.
5. Sentence Transformers generates embeddings for the extracted chunks.
6. Processed document data and embeddings are then stored in the database.
7. Documents become available for retrieval during conversations.

### Chat and RAG Pipeline

1. A user submits a message within a conversation.
2. The backend retrieves relevant document context.
3. Retrieved context is passed to the configured Gemini model.
4. The model generates a context-grounded response.
5. The response is streamed back to the client.

## Getting Started

### Prerequisites

Make sure you have the following ready:

- Python 3.14+
- uv package manager
- MongoDB
- Redis
- Google Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/YoYo178/PDFLyzer.git
cd PDFLyzer/backend
```

Install dependencies:

```bash
uv sync
```

### Environment Configuration

Create a `.env` file in the backend directory and configure the required environment variables.

The configuration should include:

| Variable | Description |
|---|---|
| MongoDB URI | MongoDB connection string |
| Redis URL | Redis connection URL |
| Gemini API Key | Google Gemini API credentials |
| JWT Secret | Secret used for signing authentication tokens |
| SMTP Configuration | Email delivery credentials |
| Application Settings | Environment-specific application configuration |

Refer to the application's settings implementation for the exact environment variable names and required values.

### Running the Application

Start the FastAPI development server:

```bash
uv run uvicorn backend.main:app --reload
```

Start the background worker in a separate terminal:

```bash
uv run arq backend.worker.WorkerSettings
```

*Adjust the module paths if your application entry points differ.*

## API Documentation

Once the API server is running, interactive API documentation is available at:

- **Swagger UI:** `/docs`
- **ReDoc:** `/redoc`
- **OpenAPI Schema:** `/openapi.json`

## Development

Install development dependencies:

```bash
uv sync --group dev
```

Run Ruff linting:

```bash
uv run ruff check .
```

Format the code:

```bash
uv run ruff format .
```

Run Pyright:

```bash
uv run pyright
```

## Related Projects

PDFLyzer consists of separate frontend and backend applications.

- **Frontend:** [PDFLyzer Frontend](https://github.com/YoYo178/pdflyzer/tree/main/frontend)
- **Backend:** PDFLyzer Backend (You're here!)
