const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar se o usuário está autenticado
 */
const authenticate = (req, res, next) => {
  try {
    // Obtém o token do cabeçalho de autorização
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    // Verifica se o formato do token é válido
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ message: 'Erro no formato do token' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ message: 'Token mal formatado' });
    }

    // Verifica se o token é válido
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      // Adiciona as informações do usuário decodificadas à requisição
      req.userId = decoded.id;
      req.userRole = decoded.role;
      return next();
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao autenticar usuário', error: error.message });
  }
};

/**
 * Middleware para verificar se o usuário tem permissão de administrador
 */
const isAdmin = (req, res, next) => {
  try {
    if (req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado. Permissão de administrador necessária.' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao verificar permissão', error: error.message });
  }
};

/**
 * Middleware para verificar se o usuário é administrador ou vendedor
 */
const isAdminOrSeller = (req, res, next) => {
  try {
    if (req.userRole !== 'ADMIN' && req.userRole !== 'SELLER') {
      return res.status(403).json({ message: 'Acesso negado. Permissão de administrador ou vendedor necessária.' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao verificar permissão', error: error.message });
  }
};

module.exports = {
  authenticate,
  isAdmin,
  isAdminOrSeller
};