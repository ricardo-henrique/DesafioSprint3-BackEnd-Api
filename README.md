# 🍔 Liso Lanches - Sistema de Delivery

O **Liso Lanches** é uma solução completa de delivery desenvolvida para gerenciar o cardápio e os pedidos de uma lanchonete moderna. O projeto combina um back-end robusto em ASP.NET Core com uma interface de usuário dinâmica e responsiva, permitindo tanto a gestão administrativa quanto a experiência de compra do cliente final.

---

## 🚀 Tecnologias Utilizadas

### Back-end
- **ASP.NET Core 8.0**: Framework principal.
- **Entity Framework Core**: ORM para persistência de dados.
- **MySQL**: Banco de dados relacional.
- **JWT (JSON Web Tokens)**: Autenticação e autorização segura.
- **BCrypt**: Criptografia de senhas.

### Front-end
- **HTML5 & CSS3**: Estrutura e estilização (Vanilla CSS).
- **JavaScript (ES6+)**: Lógica dinâmica e consumo de APIs.
- **Bootstrap 5**: Framework CSS para design responsivo.
- **SweetAlert2**: Notificações e alertas elegantes.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos
- .NET SDK 8.0+
- MySQL Server

### Passo a Passo

1. **Configuração do Banco de Dados**:
   - Localize o arquivo `appsettings.json` na pasta `LisoLanches/`.
   - Atualize a `DefaultConnection` com as suas credenciais do MySQL.

2. **Migrações**:
   No Visual Studio, abra o **Console do Gerenciador de Pacotes** (Tools > NuGet Package Manager > Package Manager Console) e execute:
   ```powershell
   Update-Database
   ```
   *(Ou use `dotnet ef database update` via terminal se preferir).*

3. **Rodar a Aplicação**:
   - No Visual Studio, basta pressionar **F5** ou clicar no botão de "Play" (LisoLanches).
   - A aplicação abrirá automaticamente o navegador na tela de login do cliente (`/index.html`).

---

## 🔑 Criação de Usuário Administrador

Para acessar o painel administrativo, é necessário possuir a role `ADMIN`. Siga o fluxo abaixo:

1. **Criar o Usuário**: Acesse o **Swagger** da aplicação (geralmente em `/swagger`) ou use a tela de cadastro para criar um usuário com o e-mail: `admin@lisolanches.com`.
2. **Promover a Admin**: Após criar o usuário, abra o MySQL Workbench e execute o script localizado em:
   📁 `LisoLanches/sql/create_admin_user.sql`

Este script localizará o usuário pelo e-mail e fará o vínculo necessário com a role de administrador no banco de dados.

---

## 🔄 Fluxo da Aplicação

### 1. Área Administrativa (`/pages/admin-login.html`)
- **Login**: O administrador acessa com as credenciais criadas via SQL.
- **Dashboard**: Visualização de usuários cadastrados e itens do cardápio.
- **Gestão de Itens**: Criação de novos lanches com upload de imagem, preço e status de disponibilidade.

### 2. Experiência do Cliente (`/index.html`)
- **Autenticação**: O cliente se cadastra ou faz login.
- **Cardápio (`home-page.html`)**: Navegação pelos itens disponíveis, adição ao carrinho e visualização do subtotal.
- **Checkout**: Revisão do pedido, escolha da forma de pagamento e confirmação da compra.
- **Acompanhamento**: Seção "Meus Pedidos" para consultar o histórico e status das ordens em tempo real.

---

## 📁 Estrutura de Pastas Relevante

- `LisoLanches/Controllers`: Endpoints da API.
- `LisoLanches/Models`: Modelos de dados e Entidades.
- `LisoLanches/Services`: Lógica de negócio e processamento de imagens.
- `LisoLanches/wwwroot`: Arquivos estáticos (HTML, CSS, JS e imagens de upload).
- `LisoLanches/sql`: Scripts de infraestrutura de banco de dados.
