# Dockerfile para Acessly - React Native com Expo (modo web e mobile)

# Node 22 LTS: compatível com Expo SDK 52+ e React Native 0.81+
FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Instalar git (necessário para dependências npm baseadas em repositórios git)
RUN apk add --no-cache git

# Copiar apenas os arquivos de dependência primeiro (melhor cache)
COPY package*.json ./

# Instalar dependências
RUN npm ci || npm install

# Instalar Expo CLI globalmente (opcional, mas útil)
RUN npm install -g expo-cli

# Copiar todo o código da aplicação
COPY . .

# Expo Web -> porta 8081 / Expo Mobile -> 19000–19002
EXPOSE 8081 19000 19001 19002

# Reduz ruído dos logs npm
ENV NPM_CONFIG_LOGLEVEL=error

# Comando padrão (modo web)
CMD ["npx", "expo", "start", "--web"]
