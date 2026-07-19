FROM python:3.11-slim

# Choreo wajib non-root user dengan UID 10001-20000
RUN groupadd -g 10001 appuser && \
    useradd -r -u 10001 -g appuser appuser

WORKDIR /app

COPY Backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY Backend/ .

RUN chown -R 10001:10001 /app

USER 10001

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
