# Этап 1: сборка приложения
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап 2: запуск через nginx
FROM nginx:stable-alpine AS production

# Копируем собранный билд в директорию nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx (опционально, можно не копировать)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]