# Stage 1: Build the Next.js frontend
FROM node:20-slim AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build the Python backend and serve the frontend
FROM python:3.11-slim
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Copy the built frontend from the node-builder stage
COPY --from=node-builder /app/out ./out

# Expose the default port (though run.py will handle port selection via PORT environment variable)
EXPOSE 8000

# Run the application via the custom startup script
CMD ["python", "run.py"]
