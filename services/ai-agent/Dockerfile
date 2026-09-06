# ◈ AI Agent Containerfile (Python 3.12 Slim)
FROM python:3.12-slim AS builder

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY services/ai-agent/pyproject.toml .
RUN uv venv /opt/venv && uv pip sync --python /opt/venv/bin/python pyproject.toml

FROM python:3.12-slim AS runner

WORKDIR /app

ENV PATH="/opt/venv/bin:$PATH"
COPY --from=builder /opt/venv /opt/venv
COPY services/ai-agent/src/ src/

EXPOSE 8002

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8002/health')" || exit 1

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8002"]
