# Dockerfile para Acessly - React Native com Expo (modo web e mobile)

FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

# Copiar apenas os arquivos de dependências
COPY package*.json ./

# Instalar dependências do projeto
RUN npm install

# Instalar Expo CLI e ngrok (para modo tunnel) globalmente
RUN npm install -g expo-cli @expo/ngrok

# Copiar o restante do código
COPY . .

# Instalar automaticamente dependências necessárias para modo Web (react-native-web, react-dom, scheduler)
RUN npx expo install react-native-web react-dom scheduler --non-interactive || true

# Expor as portas do Expo
EXPOSE 8081 19000 19001 19002

# Desativar telemetria e mensagens desnecessárias
ENV NPM_CONFIG_LOGLEVEL=error
ENV EXPO_NO_TELEMETRY=1
ENV CI=false

# Comando padrão (pode ser trocado pelo docker-compose)
CMD ["npx", "expo", "start", "--web"]
