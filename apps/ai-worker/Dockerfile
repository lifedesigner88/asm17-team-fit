FROM python:3.11.15-slim

WORKDIR /workspace

ENV UV_PROJECT_ENVIRONMENT=/tmp/persona-ai-worker-venv
ENV UV_LINK_MODE=copy

RUN pip install --no-cache-dir uv

COPY apps/ai-worker ./apps/ai-worker

RUN uv sync --project apps/ai-worker

CMD ["sh", "-c", "cd apps/ai-worker && uv run python -u -m worker.main"]
