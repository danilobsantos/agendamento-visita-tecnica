const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Inicializa o Prisma Client
const prisma = new PrismaClient();

// Cria a aplicação Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importa as rotas
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const teamRoutes = require('./routes/team.routes');
const clientRoutes = require('./routes/client.routes');
const visitRoutes = require('./routes/visit.routes');
const serviceRoutes = require('./routes/service.routes');

// Configura as rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/services', serviceRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Agendamento funcionando!' });
});

// Exporta a aplicação Express e o cliente Prisma
module.exports = { app, prisma };