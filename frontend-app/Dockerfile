# Dockerfile para Acessly - React Native com Expo (modo web e mobile)

# Imagem base já inclui Node e npm, então não precisa de "sudo apt install npm"
FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar pacotes do sistema (git e bash)
RUN apk add --no-cache git bash

# Copiar apenas os arquivos de dependência
COPY package*.json ./

# Instalar dependências do projeto
RUN npm install

# Instalar Expo CLI e ngrok globalmente
RUN npm install -g expo-cli @expo/ngrok

# Copiar o restante do código do projeto
COPY . .

# Instalar automaticamente dependências necessárias para modo Web
# (equivalente a rodar: npx expo install react-dom react-native-web)
RUN npx expo install react-dom react-native-web scheduler --non-interactive || true

# Expor portas usadas pelo Expo
EXPOSE 8081 19000 19001 19002

# Desativar telemetria e logs desnecessários
ENV NPM_CONFIG_LOGLEVEL=error
ENV EXPO_NO_TELEMETRY=1
ENV CI=false

# Comando padrão para iniciar o Expo (modo web)
CMD ["npx", "expo", "start", "--web"]
