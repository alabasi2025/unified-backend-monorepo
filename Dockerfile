FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 3000

CMD ["npx", "nx", "serve", "api-gateway", "--host", "0.0.0.0"]
