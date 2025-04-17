
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
  Link,
  Spinner,
  Center
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiCalendar, FiUsers, FiTool, FiClipboard, FiPieChart, FiMoreVertical, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import AdminLayout from './Layout';
import { adminService } from '../../services/adminService';
import { visitService } from '../../services/visitService';
import { serviceService } from '../../services/serviceService';

const AdminDashboard = () => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const statCardBg = useColorModeValue('gray.50', 'gray.700');

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => adminService.getClients()
  });

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => adminService.getTeams()
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
  });

  const { data: visits = [], isLoading: visitsLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: () => visitService.getVisits()
  });

  const stats = {
    agendamentos: {
      total: visits.length,
      pendentes: visits.filter(v => v.status === 'SCHEDULED').length,
      concluidos: visits.filter(v => v.status === 'COMPLETED').length,
      crescimento: '+23%'
    },
    clientes: {
      total: clients.length,
      novos: clients.filter(c => {
        const createdAt = new Date(c.createdAt);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return createdAt > oneMonthAgo;
      }).length,
      crescimento: '+15%'
    },
    equipes: {
      total: teams.length,
      ativas: teams.filter(t => t.active).length
    },
    servicos: {
      total: services.length
    }
  };

  if (visitsLoading || teamsLoading || servicesLoading || clientsLoading) {
    return (
      <AdminLayout>
        <Center h="100vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      </AdminLayout>
    );
  }

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
                {visits.slice(0, 3).map((visit) => (
                  <Box key={visit.id} p={3} borderWidth="1px" borderRadius="md">
                    <Flex justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{visit.client?.name || 'Cliente não encontrado'}</Text>
                        <Text fontSize="sm" color="gray.500">{visit.service?.name || 'Serviço não encontrado'}</Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontWeight="medium">{visit.scheduledDate ? format(new Date(visit.scheduledDate), 'dd/MM/yyyy HH:mm') : 'Data não definida'}</Text>
                        <Text fontSize="sm" color="blue.500">{visit.team?.name || 'Equipe não encontrada'}</Text>
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
                {teams.slice(0, 3).map((team) => (
                  <Box key={team.id} p={3} borderWidth="1px" borderRadius="md">
                    <Flex justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{team.name}</Text>
                        <Text fontSize="sm" color="gray.500">{team.members.length} membros</Text>
                      </VStack>
                      <Text color="green.500" fontWeight="medium">{team.active ? 'Ativa' : 'Inativa'}</Text>
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