const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Função auxiliar para gerar datas aleatórias dentro de um intervalo
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  try {
    console.log('Iniciando seed do banco de dados...');

    // Cria uma equipe para associar aos usuários
    const team = await prisma.team.upsert({
      where: { id: 'team-seed-id-1' },
      update: {},
      create: {
        id: 'team-seed-id-1',
        name: 'Equipe Teste',
      },
    });

    console.log(`Equipe criada: ${team.name}`);

    // Senha padrão para todos os usuários de teste
    const password = await bcrypt.hash('senha123', 10);

    // Criar usuário Administrador
    const admin = await prisma.user.upsert({
      where: { email: 'admin@teste.com' },
      update: {},
      create: {
        name: 'Administrador',
        email: 'admin@teste.com',
        password,
        role: 'ADMIN',
      },
    });

    console.log(`Usuário Admin criado: ${admin.email}`);

    // Criar usuário Vendedor
    const seller = await prisma.user.upsert({
      where: { email: 'vendedor@teste.com' },
      update: {},
      create: {
        name: 'Vendedor',
        email: 'vendedor@teste.com',
        password,
        role: 'SELLER',
      },
    });

    console.log(`Usuário Vendedor criado: ${seller.email}`);

    // Criar usuário Equipe de Campo
    const fieldTeam = await prisma.user.upsert({
      where: { email: 'campo@teste.com' },
      update: {},
      create: {
        name: 'Equipe de Campo',
        email: 'campo@teste.com',
        password,
        role: 'FIELD_TEAM',
        teamId: team.id,
      },
    });

    console.log(`Usuário Equipe de Campo criado: ${fieldTeam.email}`);

    // Criar serviços
    const services = [];
    const serviceNames = [
      { name: 'Instalação de Ar Condicionado', duration: 180 },
      { name: 'Manutenção Preventiva', duration: 120 },
      { name: 'Limpeza de Ar Condicionado', duration: 90 },
      { name: 'Reparo de Vazamento', duration: 60 },
      { name: 'Troca de Gás', duration: 45 }
    ];

    for (const serviceData of serviceNames) {
      const service = await prisma.service.create({
        data: {
          name: serviceData.name,
          description: `Serviço de ${serviceData.name.toLowerCase()}`,
          duration: serviceData.duration
        }
      });
      services.push(service);
      console.log(`Serviço criado: ${service.name}`);
    }

    // Criar clientes
    const clients = [];
    const clientsData = [
      {
        name: 'Empresa ABC Ltda',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        phone: '(11) 98765-4321',
        email: 'contato@empresaabc.com'
      },
      {
        name: 'Comércio XYZ',
        address: 'Avenida Principal, 456',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '20000-000',
        phone: '(21) 98765-4321',
        email: 'contato@comercioxyz.com'
      },
      {
        name: 'Indústria 123',
        address: 'Distrito Industrial, 789',
        city: 'Belo Horizonte',
        state: 'MG',
        zipCode: '30000-000',
        phone: '(31) 98765-4321',
        email: 'contato@industria123.com'
      }
    ];

    for (const clientData of clientsData) {
      const client = await prisma.client.create({
        data: clientData
      });
      clients.push(client);
      console.log(`Cliente criado: ${client.name}`);
    }

    // Criar visitas/agendamentos
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 dias à frente

    for (const client of clients) {
      const visitDate = randomDate(startDate, endDate);
      const startTime = new Date(visitDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0));
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 horas de duração

      const visit = await prisma.visit.create({
        data: {
          title: `Visita - ${client.name}`,
          description: 'Visita técnica agendada',
          date: visitDate,
          startTime: startTime,
          endTime: endTime,
          status: 'SCHEDULED',
          location: client.address,
          client: { connect: { id: client.id } },
          team: { connect: { id: team.id } },
          createdBy: { connect: { id: seller.id } },
          services: {
            connect: [{ id: services[Math.floor(Math.random() * services.length)].id }]
          }
        }
      });
      console.log(`Visita criada para: ${client.name}`);
    }

    console.log('Seed do banco de dados concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();