# Dockerfile para Acessly - React Native com Expo

# Usar imagem Node.js
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache git

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Instalar Expo CLI globalmente
RUN npm install -g expo-cli @expo/ngrok

# Copiar código fonte
COPY . .

# Expor porta do Expo
EXPOSE 8081

# Comando para iniciar o Expo
CMD ["npx", "expo", "start", "--tunnel"]