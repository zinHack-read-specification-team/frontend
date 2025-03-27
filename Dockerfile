# Этап сборки приложения
FROM node:18-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Создаем директорию для сборки
RUN mkdir -p /build

# Копируем собранные файлы в директорию сборки
RUN cp -r dist/* /build/

# Устанавливаем рабочую директорию
WORKDIR /build

# Команда для проверки наличия файлов
CMD ["ls", "-la"]