import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import App from './App';
import AcessoNegado from './pages/AcessoNegado';
import Login from './pages/Login';
import { ChakraProvider } from '@chakra-ui/react';

// Importação das páginas do painel administrativo
import AdminDashboard from './pages/admin/Dashboard';
import AdminCalendar from './pages/admin/Calendar';
import AdminTeams from './pages/admin/Teams';
import AdminClients from './pages/admin/Clients';

/**
 * Configuração das rotas da aplicação com proteção baseada em autenticação e papéis
 */
const AuthLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

const Routes = () => {
  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/acesso-negado',
          element: <AcessoNegado />,
        },
        // Rotas protegidas para administradores
        {
          path: '/admin/dashboard',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/calendar',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminCalendar />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/teams',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminTeams />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin/clients',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminClients />
            </ProtectedRoute>
          ),
        },
        // Rotas protegidas para vendedores
        {
          path: '/seller/dashboard',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN', 'SELLER']}>
              {/* <SellerDashboard /> */}
              <div>Dashboard do Vendedor</div>
            </ProtectedRoute>
          ),
        },
        // Rotas protegidas para equipe de campo
        {
          path: '/field-team/dashboard',
          element: (
            <ProtectedRoute allowedRoles={['ADMIN', 'FIELD_TEAM']}>
              {/* <FieldTeamDashboard /> */}
              <div>Dashboard da Equipe de Campo</div>
            </ProtectedRoute>
          ),
        },
      ]
    },
  ]);

  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
};

export default Routes;