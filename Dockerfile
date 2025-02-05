# Используем официальный Node.js-образ для сборки приложения
FROM node:18-alpine as build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы приложения
COPY . .

# Установка переменных окружения
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL $REACT_APP_API_URL

# Собираем приложение
RUN npm run build

# Используем nginx для запуска статических файлов
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
