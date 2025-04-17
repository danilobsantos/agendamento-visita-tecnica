import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
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
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Divider,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  InputGroup,
  InputLeftElement,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiSearch, FiClock, FiDollarSign } from 'react-icons/fi';
import AdminLayout from './Layout';
import { serviceService } from '../../services/serviceService';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getServices();
        setServices(response);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar serviços. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleOpenModal = (service = null) => {
    setSelectedService(service);
    onOpen();
  };

  const handleSaveService = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const duration = formData.get('duration');
    const price = formData.get('price');

    const serviceData = {
      name: formData.get('name'),
      description: formData.get('description'),
      duration: duration ? parseInt(duration, 10) : 0,
      price: price ? parseFloat(price.replace(',', '.')) : 0
    };

    try {
      if (selectedService) {
        await serviceService.updateService(selectedService.id, serviceData);
      } else {
        await serviceService.createService(serviceData);
      }

      const updatedServices = await serviceService.getServices();
      setServices(updatedServices);

      toast({
        title: selectedService ? 'Serviço atualizado' : 'Serviço criado',
        description: `O serviço foi ${selectedService ? 'atualizado' : 'criado'} com sucesso!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: 'Erro',
        description: `Erro ao ${selectedService ? 'atualizar' : 'criar'} serviço. Por favor, tente novamente.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await serviceService.deleteService(serviceId);
      setServices(services.filter(service => service.id !== serviceId));
      toast({
        title: 'Serviço excluído',
        description: 'O serviço foi excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir serviço. Por favor, tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`;
    }
    return `${minutes}min`;
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numericPrice);
  };

  // Filtrar serviços com base no termo de pesquisa
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Gerenciamento de Serviços</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => handleOpenModal()}>
            Novo Serviço
          </Button>
        </Flex>

        <Flex mb={6} justifyContent="space-between" alignItems="center">
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Buscar por nome ou descrição" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Flex>

        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {loading ? (
          <Flex justify="center" align="center" height="200px">
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" borderWidth="1px" borderRadius="lg">
              <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Descrição</Th>
                  <Th>Duração</Th>
                  <Th>Preço</Th>
                  <Th width="100px">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredServices.map((service) => (
                  <Tr key={service.id}>
                    <Td fontWeight="medium">{service.name}</Td>
                    <Td>
                      <Text noOfLines={2}>{service.description}</Text>
                    </Td>
                    <Td>
                      <HStack>
                        <FiClock />
                        <Text>{formatDuration(service.duration)}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack>
                        <FiDollarSign />
                        <Text>{formatPrice(service.price)}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                          aria-label="Opções"
                        />
                        <MenuList>
                          <MenuItem icon={<FiEdit2 />} onClick={() => handleOpenModal(service)}>
                            Editar
                          </MenuItem>
                          <Divider />
                          <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDeleteService(service.id)}>
                            Excluir
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
                {filteredServices.length === 0 && (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={4}>
                      {searchTerm ? 'Nenhum serviço encontrado para esta pesquisa' : 'Nenhum serviço cadastrado'}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Modal para criar/editar serviço */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedService ? 'Editar Serviço' : 'Novo Serviço'}</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSaveService}>
              <ModalBody pb={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Nome</FormLabel>
                    <Input 
                      name="name"
                      placeholder="Nome do serviço" 
                      defaultValue={selectedService?.name || ''}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Descrição</FormLabel>
                    <Textarea
                      name="description"
                      placeholder="Descrição detalhada do serviço"
                      defaultValue={selectedService?.description || ''}
                      rows={4}
                    />
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Duração (minutos)</FormLabel>
                      <NumberInput
                        name="duration"
                        min={15}
                        step={15}
                        defaultValue={selectedService?.duration || 60}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Preço (R$)</FormLabel>
                      <NumberInput
                        name="price"
                        min={0}
                        precision={2}
                        step={10}
                        defaultValue={selectedService?.price || 0}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </HStack>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button type="submit" colorScheme="blue" mr={3}>
                  Salvar
                </Button>
                <Button onClick={onClose}>Cancelar</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </AdminLayout>
  );
};

export default ServicesPage;