# 🌐 Acessly
Esse projeto consiste em uma API REST desenvolvida na disciplina de Java Advanced, e um aplicativo mobile desenvolvido na disciplina de Mobile Application Development. Ambos foram implementados para fins acadêmicos na disciplina de Devops Tools e Cloud Computing. O objetivo é demonstrar a utilização de máquinas virtuais em nuvem e o deploy de aplicações com Docker, aplicando conceitos de Devops e Cloud Computing.

---

## ⚙️ Tecnologias Utilizadas
- **Java 17:** Linguagem principal da aplicação backend.
- **Spring Boot:** Framework para criação de APIs REST.
- **Maven:** Gerenciador de dependências e build.
- **React Native:** Framework para desenvolvimento de aplicações móveis multiplataforma.
- **Expo:** Ferramenta que facilita o desenvolvimento, build e deploy de apps React Native.
- **Expo Router:** Biblioteca para navegação e roteamento de páginas em aplicativos Expo/React Native.
- **Axios:** Biblioteca para realizar requisições HTTP de forma simples e eficiente.
- **Docker:** Ferramenta de containerização da aplicação.
- **Docker Compose:** Ferramenta para orquestrar containers da aplicação.
- **Linux:** Sistema operacional da máquina virtual responsável pela API REST.
- **Windows:** Sistema operacional da máquina virtual responsável pelo App Mobile.
- **Azure:** Plataforma em nuvem utilizada para o deploy.

---

## 🚀 Como Usar

1. **Clone o Repositório:**

   ```bash
   git clone https://github.com/acessly/acessly-devops.git
   cd acessly-devops
   ```

2. **Acesse a pasta da API:**

   ```bash
   cd backend-api
   ```

3. **Construa e Execute o container em background:**

   ```bash
   docker-compose up -d
   ```

4. **Verificar se a API esta rodando:**

   ```bash
   docker ps
   ```

5. **Acesse a pasta do App:**

   ```bash
   cd frontend-app
   ```

6. **Construa e Execute o container em background:**

   ```bash
   docker-compose up -d
   ```

7. **Verificar se o App esta rodando:**

   ```bash
   docker ps
   ```

---

## ☁️ Deploy na Máquina Virtual (Azure)

1. **Conectar na VM com Aplicação Back-End:**

   ```bash
   ssh azureuser@<ip-publico>
   ```

2. **Atualizar Pacotes do Sistema:**

   ```bash
   sudo apt update -y
   ```

3. **Instalar Docker:**

   ```bash
   sudo apt install docker.io -y
   ```

4. **Instalar o Docker-Compose:**

   ```bash
   sudo apt install docker-compose
   ```

5. **Iniciar o serviço Docker:**

   ```bash
   sudo systemctl start docker
   ```

6. **Permitir uso do Docker sem sudo:**
   
   ```bash
   sudo usermod -aG docker $USER
   ```

7. **Encerrar a sessão atual:**

   ```bash
   exit
   ```

8. **Reconectar na VM:**

   ```bash
   ssh azureuser@<ip-publico>
   ```

9. **Clone o repositório:**

   ```bash
   git clone https://github.com/acessly/acessly-devops.git
   cd acessly-devops
   cd backend-api
   ```

10. **Executando o Docker Compose:**

    ```bash
    docker-compose up -d
    ```

11. **Verificar se está rodando:**

    ```bash
    docker ps
    ```

11. **Acessando documentação da API:**

    ```bash
    http://<ip-pubico>:8080/swagger-ui/index.html
    ```

12. **Conectar na VM com Aplicação Front-End:**
