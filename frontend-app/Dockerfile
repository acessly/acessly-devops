# Dockerfile para Acessly - React Native com Expo (modo web e mobile)

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

# Copiar apenas os arquivos de dependências
COPY package*.json ./

# ⚠️ Usar somente npm install (remove o npm ci)
RUN npm install

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli

# Copiar todo o código
COPY . .

# Expo Web -> 8081 | Expo Mobile -> 19000–19002
EXPOSE 8081 19000 19001 19002

ENV NPM_CONFIG_LOGLEVEL=error
ENV EXPO_NO_TELEMETRY=1
ENV CI=false

# Comando padrão (modo web)
CMD ["npx", "expo", "start", "--web"]
