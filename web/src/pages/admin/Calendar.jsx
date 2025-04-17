import { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Grid,
  GridItem,
  Badge,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Spinner,
  Center,
  useToast
} from '@chakra-ui/react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiMoreVertical, FiClock, FiUser, FiMapPin } from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from './Layout';
import { visitService } from '../../services/visitService';
import { adminService } from '../../services/adminService';
import { serviceService } from '../../services/serviceService';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Mover hooks useColorModeValue para o nível superior do componente
  const dayBgColor = useColorModeValue('white', 'gray.700');
  const dayBorderColor = useColorModeValue('gray.200', 'gray.600');
  
  const statusColors = {
    SCHEDULED: 'blue',
    IN_PROGRESS: 'orange',
    COMPLETED: 'green',
    CANCELLED: 'red'
  };

  const { data: visits = [], isLoading: visitsLoading } = useQuery({
    queryKey: ['visits'],
    queryFn: () => visitService.getVisits(),
    onError: (error) => {
      toast({
        title: 'Erro ao carregar agendamentos',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => adminService.getTeams()
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices()
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => adminService.getClients()
  });

  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    date: '',
    startTime: '',
    endTime: '',
    teamId: '',
    serviceId: '',
    location: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createVisitMutation = useMutation({
    mutationFn: (visitData) => {
      const [date, startTime, endTime] = [visitData.date, visitData.startTime, visitData.endTime];
      
      const scheduledDate = new Date(`${date}T${startTime}`);
      const endDate = endTime ? new Date(`${date}T${endTime}`) : null;

      if (isNaN(scheduledDate.getTime())) {
        throw new Error('Data ou hora de início inválida');
      }

      if (endTime && isNaN(endDate.getTime())) {
        throw new Error('Hora de término inválida');
      }

      return visitService.createVisit({
        title: visitData.title,
        description: visitData.description,
        date: scheduledDate.toISOString(),
        startTime: scheduledDate.toISOString(),
        endTime: endDate?.toISOString() || null,
        location: visitData.location,
        clientId: visitData.clientId,
        teamId: visitData.teamId,
        serviceIds: visitData.serviceId ? [visitData.serviceId] : []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['visits']);
      toast({
        title: 'Agendamento criado',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      onClose();
      setFormData({
        title: '',
        clientId: '',
        date: '',
        startTime: '',
        endTime: '',
        teamId: '',
        serviceId: '',
        location: '',
        description: ''
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar agendamento',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    }
  });

  if (visitsLoading || teamsLoading || servicesLoading || clientsLoading) {
    return (
      <AdminLayout>
        <Center h="100vh">
          <Spinner size="xl" color="blue.500" />
        </Center>
      </AdminLayout>
    );
  }

  const events = visits.map(visit => (
    {
      id: visit.id,
      title: visit.service?.name || 'Serviço não encontrado',
      client: visit.client?.name || 'Cliente não encontrado',
      team: visit.team?.name || 'Equipe não encontrada',
      date: new Date(visit.scheduledDate),
      endTime: new Date(visit.endDate),
      status: visit.status,
      location: visit.location
    }
  ));

  // Navegação do calendário
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

  // Gerar dias do mês atual
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Encontrar eventos para um dia específico
  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day.getDate() && 
              eventDate.getMonth() === day.getMonth() && 
              eventDate.getFullYear() === day.getFullYear();
    });
  };

  // Renderizar visualização mensal
  const renderMonthView = () => {
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    return (
      <Box>
        <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={4}>
          {weekDays.map(day => (
            <GridItem key={day} textAlign="center" fontWeight="bold" py={2}>
              {day}
            </GridItem>
          ))}
        </Grid>
        
        <Grid templateColumns="repeat(7, 1fr)" gap={1}>
          {monthDays.map(day => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            
            return (
              <GridItem 
                key={day.toString()} 
                bg={isTodayDate ? 'blue.50' : dayBgColor}
                borderWidth={isTodayDate ? '1px' : '1px'}
                borderColor={isTodayDate ? 'blue.500' : dayBorderColor}
                borderRadius="md"
                opacity={isCurrentMonth ? 1 : 0.5}
                minH="120px"
                position="relative"
                onClick={() => onOpen()}
                cursor="pointer"
                _hover={{ borderColor: 'blue.300' }}
              >
                <Text 
                  position="absolute" 
                  top={1} 
                  right={2} 
                  fontWeight={isTodayDate ? 'bold' : 'normal'}
                  color={isTodayDate ? 'blue.500' : 'inherit'}
                >
                  {day.getDate()}
                </Text>
                
                <VStack spacing={1} pt={7} px={1} align="stretch">
                  {dayEvents.map(event => (
                    <Box 
                      key={event.id} 
                      bg={`${statusColors[event.status]}.100`}
                      color={`${statusColors[event.status]}.800`}
                      p={1}
                      borderRadius="sm"
                      fontSize="xs"
                      fontWeight="medium"
                      noOfLines={1}
                    >
                      {format(new Date(event.date), 'HH:mm')} - {event.title}
                    </Box>
                  ))}
                </VStack>
              </GridItem>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // Renderizar visualização semanal
  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00
    
    return (
      <Box overflowX="auto">
        <Grid templateColumns="100px repeat(7, 1fr)" gap={1}>
          <GridItem></GridItem>
          {weekDays.map(day => (
            <GridItem 
              key={day.toString()} 
              textAlign="center" 
              fontWeight="bold" 
              py={2}
              bg={isToday(day) ? 'blue.50' : 'transparent'}
              borderRadius="md"
            >
              <Text fontSize="sm">{format(day, 'EEE', { locale: ptBR })}</Text>
              <Text 
                fontWeight={isToday(day) ? 'bold' : 'normal'}
                color={isToday(day) ? 'blue.500' : 'inherit'}
              >
                {format(day, 'dd')}
              </Text>
            </GridItem>
          ))}
          
          {hours.map(hour => (
            <React.Fragment key={hour}>
              <GridItem 
                textAlign="right" 
                pr={2} 
                py={1}
                fontSize="sm"
                color="gray.500"
                height="60px"
                borderTopWidth="1px"
                borderTopColor={useColorModeValue('gray.100', 'gray.700')}
              >
                {hour}:00
              </GridItem>
              
              {weekDays.map(day => {
                const dayEvents = events.filter(event => {
                  const eventDate = new Date(event.date);
                  return eventDate.getDate() === day.getDate() && 
                        eventDate.getMonth() === day.getMonth() && 
                        eventDate.getFullYear() === day.getFullYear() &&
                        eventDate.getHours() === hour;
                });
                
                return (
                  <GridItem 
                    key={`${day}-${hour}`} 
                    borderWidth="1px"
                    borderColor={useColorModeValue('gray.100', 'gray.700')}
                    height="60px"
                    position="relative"
                    onClick={() => onOpen()}
                    cursor="pointer"
                    _hover={{ bg: 'gray.50' }}
                  >
                    {dayEvents.map(event => (
                      <Box 
                        key={event.id} 
                        position="absolute"
                        top={1}
                        left={1}
                        right={1}
                        bg={`${statusColors[event.status]}.100`}
                        color={`${statusColors[event.status]}.800`}
                        p={1}
                        borderRadius="sm"
                        fontSize="xs"
                        fontWeight="medium"
                        zIndex={1}
                      >
                        <Text noOfLines={1}>{event.title}</Text>
                        <Text fontSize="xx-small">{event.client}</Text>
                      </Box>
                    ))}
                  </GridItem>
                );
              })}
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <AdminLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Calendário de Agendamentos</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
            Novo Agendamento
          </Button>
        </Flex>

        <HStack spacing={4} mb={6} justify="space-between">
          <HStack>
            <IconButton
              icon={<FiChevronLeft />}
              onClick={view === 'month' ? prevMonth : prevWeek}
              aria-label="Mês anterior"
              variant="outline"
            />
            <Heading size="md">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy', { locale: ptBR })
                : `${format(currentDate, 'dd')} - ${format(addDays(currentDate, 6), 'dd')} de ${format(currentDate, 'MMMM yyyy', { locale: ptBR })}`
              }
            </Heading>
            <IconButton
              icon={<FiChevronRight />}
              onClick={view === 'month' ? nextMonth : nextWeek}
              aria-label="Próximo mês"
              variant="outline"
            />
          </HStack>
          
          <Tabs variant="soft-rounded" colorScheme="blue" size="sm" defaultIndex={0} onChange={(index) => setView(index === 0 ? 'month' : 'week')}>
            <TabList>
              <Tab>Mensal</Tab>
              <Tab>Semanal</Tab>
            </TabList>
          </Tabs>
        </HStack>

        {view === 'month' ? renderMonthView() : renderWeekView()}

        {/* Modal para criar/editar agendamento */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Novo Agendamento</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Título do agendamento"
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleInputChange}
                    placeholder="Selecione o cliente"
                  >
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Data</FormLabel>
                    <Input
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Hora Início</FormLabel>
                    <Input
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Hora Fim</FormLabel>
                    <Input
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                </HStack>
                
                <FormControl isRequired>
                  <FormLabel>Equipe</FormLabel>
                  <Select
                    name="teamId"
                    value={formData.teamId}
                    onChange={handleInputChange}
                    placeholder="Selecione a equipe"
                  >
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Serviços</FormLabel>
                  <Select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleInputChange}
                    placeholder="Selecione o serviço"
                  >
                    {services.map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Localização</FormLabel>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Endereço do agendamento"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detalhes do agendamento"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                isLoading={createVisitMutation.isPending}
                onClick={() => {
                  if (!formData.title || !formData.clientId || !formData.date || !formData.startTime || !formData.teamId) {
                    toast({
                      title: 'Campos obrigatórios',
                      description: 'Por favor, preencha todos os campos obrigatórios',
                      status: 'error',
                      duration: 3000,
                      isClosable: true
                    });
                    return;
                  }
                  createVisitMutation.mutate(formData);
                }}
              >
                Salvar
              </Button>
              <Button onClick={onClose}>Cancelar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </AdminLayout>
  );
};

export default CalendarView;