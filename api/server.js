const dotenv = require('dotenv');

// Carrega as variáveis de ambiente
dotenv.config();

// Importa a aplicação Express configurada
const { app, prisma } = require('./src/app');

// Porta do servidor
const PORT = process.env.PORT || 3001;

// Função para iniciar o servidor
async function startServer() {
  try {
    // Conecta ao banco de dados
    await prisma.$connect();
    console.log('Conexão com o banco de dados estabelecida');
    
    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Inicia o servidor
startServer();