import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente para proteger rotas que requerem autenticação
 * e verificar permissões baseadas em papéis (roles)
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  // Enquanto verifica a autenticação, mostra um indicador de carregamento
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado, redireciona para a página de login
  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se houver roles especificadas, verifica se o usuário tem permissão
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    // Redireciona para uma página de acesso negado ou para o dashboard apropriado
    return <Navigate to="/acesso-negado" replace />;
  }

  // Se estiver autenticado e tiver as permissões necessárias, renderiza o conteúdo
  return children;
};

export default ProtectedRoute;