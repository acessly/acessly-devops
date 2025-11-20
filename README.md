# 🌐 Acessly
Esse projeto consiste em uma API REST desenvolvida na disciplina de Java Advanced, e um aplicativo mobile desenvolvido na disciplina de Mobile Application Development. Ambos foram implementados para fins acadêmicos na disciplina de Devops Tools e Cloud Computing. O objetivo é demonstrar a utilização de máquinas virtuais em nuvem e o deploy de aplicações com Docker, aplicando conceitos de Devops e Cloud Computing.

---

## ⚙️ Tecnologias Utilizadas
- **Java 17:** Linguagem principal da aplicação backend.
- **Spring Boot:** Framework para criação de APIs REST.
- **Maven:** Gerenciador de dependências e build.
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

4. **Verificar se esta rodando:**

   ```bash
   docker ps
   ```
