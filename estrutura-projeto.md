# Estrutura do Projeto de Agendamento

Este documento descreve a estrutura proposta para o sistema de agendamento de equipes de campo.

## Estrutura de Diretórios

```
agendamento/
├── api/                      # Backend da aplicação
│   ├── src/
│   │   ├── controllers/      # Controladores da API
│   │   ├── middlewares/      # Middlewares (autenticação, validação)
│   │   ├── models/           # Modelos de dados
│   │   ├── routes/           # Rotas da API
│   │   ├── services/         # Serviços de negócio
│   │   ├── utils/            # Utilitários
│   │   └── app.js            # Configuração do Express
│   ├── prisma/
│   │   └── schema.prisma     # Schema do Prisma ORM
│   ├── .env                  # Variáveis de ambiente
│   ├── package.json          # Dependências do backend
│   └── server.js             # Ponto de entrada da aplicação
│
├── web/                      # Frontend da aplicação
│   ├── public/               # Arquivos estáticos
│   ├── src/
│   │   ├── assets/           # Imagens, ícones, etc.
│   │   ├── components/       # Componentes React reutilizáveis
│   │   ├── contexts/         # Contextos React (autenticação, etc.)
│   │   ├── hooks/            # Hooks personalizados
│   │   ├── pages/            # Páginas da aplicação
│   │   │   ├── admin/        # Páginas do administrador
│   │   │   ├── seller/       # Páginas do vendedor
│   │   │   └── field-team/   # Páginas da equipe de campo
│   │   ├── services/         # Serviços de API
│   │   ├── utils/            # Utilitários
│   │   ├── App.jsx           # Componente principal
│   │   └── main.jsx          # Ponto de entrada do React
│   ├── .env                  # Variáveis de ambiente
│   └── package.json          # Dependências do frontend
│
└── README.md                 # Documentação do projeto
```

## Modelos de Dados (Schema Prisma)

```prisma
// Modelo de Usuário
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(FIELD_TEAM)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  team      Team?    @relation(fields: [teamId], references: [id])
  teamId    String?
  visits    Visit[]  // Visitas agendadas por vendedores
}

// Enum para os tipos de usuário
enum Role {
  ADMIN
  SELLER
  FIELD_TEAM
}

// Modelo de Equipe
model Team {
  id        String   @id @default(uuid())
  name      String
  members   User[]
  visits    Visit[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Modelo de Cliente
model Client {
  id        String   @id @default(uuid())
  name      String
  address   String
  city      String
  state     String
  zipCode   String
  phone     String
  email     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  visits    Visit[]
}

// Modelo de Visita/Agendamento
model Visit {
  id          String    @id @default(uuid())
  title       String
  description String?
  date        DateTime
  startTime   DateTime
  endTime     DateTime?
  status      Status    @default(SCHEDULED)
  imageUrl    String?
  location    String?
  notes       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  client      Client    @relation(fields: [clientId], references: [id])
  clientId    String
  team        Team      @relation(fields: [teamId], references: [id])
  teamId      String
  createdBy   User      @relation(fields: [createdById], references: [id])
  createdById String
  services    Service[]
}

// Enum para o status da visita
enum Status {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

// Modelo de Serviço
model Service {
  id          String   @id @default(uuid())
  name        String
  description String?
  duration    Int      // Duração em minutos
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  visits      Visit[]
}
```

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/logout` - Logout de usuário

### Usuários
- `GET /api/users` - Listar usuários (Admin)
- `GET /api/users/:id` - Obter usuário específico
- `POST /api/users` - Criar usuário (Admin)
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Remover usuário (Admin)

### Equipes
- `GET /api/teams` - Listar equipes
- `GET /api/teams/:id` - Obter equipe específica
- `POST /api/teams` - Criar equipe (Admin)
- `PUT /api/teams/:id` - Atualizar equipe (Admin)
- `DELETE /api/teams/:id` - Remover equipe (Admin)

### Clientes
- `GET /api/clients` - Listar clientes
- `GET /api/clients/:id` - Obter cliente específico
- `POST /api/clients` - Criar cliente (Admin/Vendedor)
- `PUT /api/clients/:id` - Atualizar cliente (Admin/Vendedor)
- `DELETE /api/clients/:id` - Remover cliente (Admin)

### Visitas/Agendamentos
- `GET /api/visits` - Listar visitas (filtros por data, equipe, status)
- `GET /api/visits/:id` - Obter visita específica
- `POST /api/visits` - Criar visita (Admin/Vendedor)
- `PUT /api/visits/:id` - Atualizar visita
- `DELETE /api/visits/:id` - Cancelar visita
- `PUT /api/visits/:id/complete` - Marcar visita como concluída (Equipe)

### Serviços
- `GET /api/services` - Listar serviços
- `GET /api/services/:id` - Obter serviço específico
- `POST /api/services` - Criar serviço (Admin)
- `PUT /api/services/:id` - Atualizar serviço (Admin)
- `DELETE /api/services/:id` - Remover serviço (Admin)

### Relatórios
- `GET /api/reports/team/:teamId` - Relatório de visitas por equipe
- `GET /api/reports/client/:clientId` - Relatório de visitas por cliente
- `GET /api/reports/hours` - Relatório de horas trabalhadas

## Páginas do Frontend

### Comuns
- Login
- Dashboard (personalizado por tipo de usuário)

### Administrador
- Gerenciamento de Usuários
- Gerenciamento de Equipes
- Gerenciamento de Clientes
- Gerenciamento de Serviços
- Agenda (visualização mensal e semanal)
- Relatórios

### Vendedor
- Gerenciamento de Clientes
- Agenda (visualização mensal e semanal)
- Criação e edição de visitas

### Equipe de Campo
- Agenda do dia
- Detalhes da visita (com mapa e informações)
- Registro de conclusão de serviço

## Status do Projeto

✅ Ambiente de desenvolvimento configurado
✅ Backend inicializado com Node.js, Express e Prisma
✅ Frontend inicializado com React e Vite
✅ Estrutura de autenticação implementada
🔄 Desenvolvimento dos endpoints da API em andamento
🔄 Desenvolvimento das interfaces do frontend em andamento
⏳ Implementação dos relatórios pendente
⏳ Testes e refinamentos pendentes

## Tecnologias Utilizadas

### Backend
- Node.js com Express
- Prisma ORM
- PostgreSQL
- JWT para autenticação

### Frontend
- React com Vite
- React Router DOM
- Axios para requisições HTTP
- Tailwind CSS para estilização