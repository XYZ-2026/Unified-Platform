FROM python:3.10-slim

WORKDIR /app

# Install system dependencies if needed (e.g. libpq for pg client, but psycopg2-binary usually doesn't require it)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libreoffice-core \
    libreoffice-writer \
    libreoffice-impress \
    libreoffice-common \
    fonts-liberation \
    fontconfig \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Poppins fonts for perfect PDF rendering matching PPTX templates
RUN mkdir -p /usr/share/fonts/truetype/poppins \
    && curl -L -o /usr/share/fonts/truetype/poppins/Poppins-Regular.ttf https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf \
    && curl -L -o /usr/share/fonts/truetype/poppins/Poppins-Medium.ttf https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf \
    && curl -L -o /usr/share/fonts/truetype/poppins/Poppins-Bold.ttf https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf \
    && fc-cache -f -v

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
