# Sistema de Agendamento para Equipes de Campo

Este projeto é um sistema de agendamento para controle de equipes em campo, permitindo o gerenciamento de visitas, clientes e serviços.

## Screenshots
![image](https://github.com/danilobsantos/agendamento-visita-tecnica/dashboard.png)

## Funcionalidades

- Controle de agenda de agentes de campo (2 equipes ou mais)
- Visualização de agenda mensal e semanal
- Diferentes níveis de acesso (Administrador, Vendedor, Equipe de campo)
- Relatórios periódicos de atendimentos e horas trabalhadas
- Gestão de clientes recorrentes
- Informações detalhadas de serviços para equipe de campo (foto, localização, etc.)
- Registro de conclusão de serviços

## Tecnologias

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL

### Frontend
- React

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- `api/`: Backend com Node.js, Express e Prisma
- `web/`: Frontend com React

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)
- PostgreSQL (v12 ou superior)

### Configuração do Backend

1. Navegue até a pasta do backend:
   ```
   cd api
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o banco de dados PostgreSQL e atualize o arquivo `.env` com suas credenciais:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamento?schema=public"
   ```

4. Execute as migrações do Prisma para criar as tabelas no banco de dados:
   ```
   npx prisma migrate dev --name init
   ```

5. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

### Configuração do Frontend

1. Navegue até a pasta do frontend:
   ```
   cd web
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

## Tipos de Usuários

1. **Administrador**: Acesso completo a todas as funcionalidades do sistema
2. **Vendedor**: Cadastro, consulta, edição e cancelamento de visitas
3. **Equipe de campo**: Consulta, edição e cancelamento de visitas, acesso a informações de serviços

## Relatórios

- Relatório mensal de atendimentos por equipe
- Relatório de horas trabalhadas por serviço
- Relatório de visitas por cliente (para clientes recorrentes)