# Dockerfile

# Stage 1: Build stage for the WhatsApp client
FROM node:14 AS build

WORKDIR /app

# Install dependencies
COPY whatsapp.js package.json .env ./
RUN npm install

# Stage 2: Final stage
FROM python:3.9

# Copy the built Node.js application
COPY --from=build /app /app

WORKDIR /app

# Install Flask dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose the ports for Flask and Node.js
EXPOSE 5000
EXPOSE 3000

# Run both Flask and Node.js
CMD ["sh", "-c", "node whatsapp.js & python app.py"]
