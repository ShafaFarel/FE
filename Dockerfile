# Gunakan base image Python yang ringan
FROM python:3.11-slim

# Install system dependencies (Node.js dan tool compiler)
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy seluruh file monorepo ke dalam container
COPY . .

# Build React Frontend
WORKDIR /app/FE
RUN npm install
RUN npm run build

# Install Python Backend dependencies
WORKDIR /app/Backend
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 7860 (Port wajib untuk Hugging Face Spaces)
EXPOSE 7860

# Jalankan uvicorn server pada port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
