FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# 🔹 DB ready эсэх шалгахад
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 🔹 wait script executable болгох
RUN chmod +x wait-for-db.sh

CMD ["sh", "wait-for-db.sh", "python", "manage.py", "runserver", "0.0.0.0:8000"]
