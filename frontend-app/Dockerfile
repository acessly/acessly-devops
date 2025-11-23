# Dockerfile para Acessly - React Native com Expo (modo web)

# Imagem base moderna do Node.js
FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache git bash

# Copiar apenas arquivos de dependência
COPY package*.json ./

# Instalar dependências do projeto
RUN npm install

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli

# Copiar o restante do código
COPY . .

# Instalar dependências necessárias para o modo web
# (sem interação, usando CI=1)
RUN CI=1 npx expo install react-dom react-native-web scheduler || true

# Expor a porta usada pelo Expo Web
EXPOSE 8081

# Variáveis de ambiente
ENV NPM_CONFIG_LOGLEVEL=error
ENV EXPO_NO_TELEMETRY=1
ENV CI=true

# Comando padrão: iniciar Expo no modo web
CMD ["npx", "expo", "start", "--web"]
