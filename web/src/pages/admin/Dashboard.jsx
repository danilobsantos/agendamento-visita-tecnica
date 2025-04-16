import { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Divider,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorModeValue,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiCalendar, FiUsers, FiTool, FiClipboard, FiPieChart, FiMoreVertical, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import AdminLayout from './Layout';

const AdminDashboard = () => {
  const [stats] = useState({
    agendamentos: {
      total: 124,
      pendentes: 45,
      concluidos: 79,
      crescimento: '+23%'
    },
    clientes: {
      total: 87,
      novos: 12,
      crescimento: '+15%'
    },
    equipes: {
      total: 8,
      ativas: 7
    },
    servicos: {
      total: 15
    }
  });

  const cardBg = useColorModeValue('white', 'gray.700');
  const statCardBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <AdminLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Dashboard Administrativo</Heading>
          <HStack spacing={4}>
            <Link as={RouterLink} to="/admin/calendar" _hover={{ textDecoration: 'none' }}>
              <Flex align="center" bg="blue.500" color="white" px={4} py={2} borderRadius="md">
                <Icon as={FiCalendar} mr={2} />
                <Text>Calendário</Text>
              </Flex>
            </Link>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Stat bg={statCardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiCalendar} mr={2} color="blue.500" />
              Agendamentos
            </StatLabel>
            <StatNumber fontSize="3xl">{stats.agendamentos.total}</StatNumber>
            <StatHelpText>
              <HStack spacing={4}>
                <Text>{stats.agendamentos.pendentes} pendentes</Text>
                <Text>{stats.agendamentos.concluidos} concluídos</Text>
              </HStack>
              <Text color="green.500">{stats.agendamentos.crescimento} este mês</Text>
            </StatHelpText>
          </Stat>

          <Stat bg={statCardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiUsers} mr={2} color="purple.500" />
              Clientes
            </StatLabel>
            <StatNumber fontSize="3xl">{stats.clientes.total}</StatNumber>
            <StatHelpText>
              <Text>{stats.clientes.novos} novos este mês</Text>
              <Text color="green.500">{stats.clientes.crescimento} de crescimento</Text>
            </StatHelpText>
          </Stat>

          <Stat bg={statCardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiUserCheck} mr={2} color="orange.500" />
              Equipes
            </StatLabel>
            <StatNumber fontSize="3xl">{stats.equipes.total}</StatNumber>
            <StatHelpText>
              <Text>{stats.equipes.ativas} equipes ativas</Text>
            </StatHelpText>
          </Stat>

          <Stat bg={statCardBg} p={4} borderRadius="lg" boxShadow="sm">
            <StatLabel display="flex" alignItems="center">
              <Icon as={FiTool} mr={2} color="green.500" />
              Serviços
            </StatLabel>
            <StatNumber fontSize="3xl">{stats.servicos.total}</StatNumber>
            <StatHelpText>
              <Text>Serviços disponíveis</Text>
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg={cardBg} boxShadow="sm">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Próximos Agendamentos</Heading>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                    aria-label="Opções"
                  />
                  <MenuList>
                    <MenuItem as={RouterLink} to="/admin/visits">Ver todos</MenuItem>
                    <MenuItem as={RouterLink} to="/admin/visits/new">Novo agendamento</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {[1, 2, 3].map((_, index) => (
                  <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                    <Flex justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Cliente {index + 1}</Text>
                        <Text fontSize="sm" color="gray.500">Serviço de Instalação</Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontWeight="medium">Hoje, 14:00</Text>
                        <Text fontSize="sm" color="blue.500">Equipe A</Text>
                      </VStack>
                    </Flex>
                  </Box>
                ))}
                <Link as={RouterLink} to="/admin/visits" color="blue.500" alignSelf="center">
                  Ver todos os agendamentos
                </Link>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="sm">
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Heading size="md">Equipes Ativas</Heading>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="sm"
                    aria-label="Opções"
                  />
                  <MenuList>
                    <MenuItem as={RouterLink} to="/admin/teams">Ver todas</MenuItem>
                    <MenuItem as={RouterLink} to="/admin/teams/new">Nova equipe</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {[1, 2, 3].map((_, index) => (
                  <Box key={index} p={3} borderWidth="1px" borderRadius="md">
                    <Flex justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">Equipe {String.fromCharCode(65 + index)}</Text>
                        <Text fontSize="sm" color="gray.500">3 membros</Text>
                      </VStack>
                      <Text color="green.500" fontWeight="medium">Ativa</Text>
                    </Flex>
                  </Box>
                ))}
                <Link as={RouterLink} to="/admin/teams" color="blue.500" alignSelf="center">
                  Ver todas as equipes
                </Link>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard;