# Dockerfile para Acessly - React Native com Expo (modo web)

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm install

RUN npm install -g expo-cli

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start", "--web"]
