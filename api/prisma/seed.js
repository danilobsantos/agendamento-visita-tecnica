const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando seed de usuários...');

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

    console.log('Seed de usuários concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();