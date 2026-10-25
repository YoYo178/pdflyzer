
FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim

# Create an unprivileged application user.
RUN groupadd --system --gid 999 nonroot \
    && useradd --system --gid 999 --uid 999 \
        --create-home nonroot

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    PATH="/app/.venv/bin:$PATH"

# Install dependencies first to maximize build-cache reuse.
COPY pyproject.toml uv.lock ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

# Copy the package and its declared README.
COPY src/ ./src/
COPY README.md ./README.md

# Install the project itself using the existing locked dependencies.
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev

# Prepare persistent content storage with the correct permissions.
RUN mkdir -p /app/user_content \
    && chown -R nonroot:nonroot /app/user_content

USER nonroot

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
