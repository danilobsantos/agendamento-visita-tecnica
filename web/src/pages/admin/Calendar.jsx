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
  Textarea
} from '@chakra-ui/react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiMoreVertical, FiClock, FiUser, FiMapPin } from 'react-icons/fi';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AdminLayout from './Layout';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'month' ou 'week'
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Cores para os diferentes status de agendamento
  const statusColors = {
    SCHEDULED: 'blue',
    IN_PROGRESS: 'orange',
    COMPLETED: 'green',
    CANCELLED: 'red'
  };

  // Dados de exemplo para agendamentos
  const [events] = useState([
    {
      id: '1',
      title: 'Instalação de Equipamento',
      client: 'João Silva',
      team: 'Equipe A',
      date: new Date(2023, 9, 15, 10, 0),
      endTime: new Date(2023, 9, 15, 12, 0),
      status: 'SCHEDULED',
      location: 'Rua das Flores, 123'
    },
    {
      id: '2',
      title: 'Manutenção Preventiva',
      client: 'Maria Oliveira',
      team: 'Equipe B',
      date: new Date(2023, 9, 18, 14, 30),
      endTime: new Date(2023, 9, 18, 16, 0),
      status: 'COMPLETED',
      location: 'Av. Principal, 456'
    },
    {
      id: '3',
      title: 'Reparo de Emergência',
      client: 'Carlos Mendes',
      team: 'Equipe C',
      date: new Date(2023, 9, 20, 9, 0),
      endTime: new Date(2023, 9, 20, 11, 0),
      status: 'IN_PROGRESS',
      location: 'Rua Secundária, 789'
    }
  ]);

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
                bg={isTodayDate ? 'blue.50' : useColorModeValue('white', 'gray.700')}
                borderWidth={isTodayDate ? '1px' : '1px'}
                borderColor={isTodayDate ? 'blue.500' : useColorModeValue('gray.200', 'gray.600')}
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
                  <Input placeholder="Título do agendamento" />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Cliente</FormLabel>
                  <Select placeholder="Selecione o cliente">
                    <option value="cliente1">João Silva</option>
                    <option value="cliente2">Maria Oliveira</option>
                    <option value="cliente3">Carlos Mendes</option>
                  </Select>
                </FormControl>
                
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Data</FormLabel>
                    <Input type="date" />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Hora Início</FormLabel>
                    <Input type="time" />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Hora Fim</FormLabel>
                    <Input type="time" />
                  </FormControl>
                </HStack>
                
                <FormControl isRequired>
                  <FormLabel>Equipe</FormLabel>
                  <Select placeholder="Selecione a equipe">
                    <option value="equipe1">Equipe A</option>
                    <option value="equipe2">Equipe B</option>
                    <option value="equipe3">Equipe C</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Serviços</FormLabel>
                  <Select placeholder="Selecione o serviço">
                    <option value="servico1">Instalação</option>
                    <option value="servico2">Manutenção</option>
                    <option value="servico3">Reparo</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Localização</FormLabel>
                  <Input placeholder="Endereço do agendamento" />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea placeholder="Detalhes do agendamento" />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3}>
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