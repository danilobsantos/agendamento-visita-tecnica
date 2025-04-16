import { Box, Heading, Text, Button, VStack, Icon } from '@chakra-ui/react';
import { FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const AcessoNegado = () => {
  const { user } = useAuth();

  // Função para redirecionar para o dashboard apropriado com base no papel do usuário
  const irParaDashboard = () => {
    if (user?.role === 'ADMIN') {
      window.location.href = '/admin/dashboard';
    } else if (user?.role === 'SELLER') {
      window.location.href = '/seller/dashboard';
    } else {
      window.location.href = '/field-team/dashboard';
    }
  };

  return (
    <Box textAlign="center" py={10} px={6}>
      <Box display="inline-block">
        <Icon as={FiAlertTriangle} boxSize={14} color="orange.500" />
      </Box>
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Acesso Negado
      </Heading>
      <Text color="gray.500" mb={6}>
        Você não tem permissão para acessar esta página.
      </Text>

      <VStack spacing={4}>
        <Button
          colorScheme="blue"
          onClick={irParaDashboard}
        >
          Ir para o Dashboard
        </Button>
      </VStack>
    </Box>
  );
};

export default AcessoNegado;