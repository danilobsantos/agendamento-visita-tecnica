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
  Select
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiSearch, FiUser, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import AdminLayout from './Layout';
// import { api } from '../../services/api'; // Descomente quando estiver pronto para integrar com a API

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Dados de exemplo para clientes
  useEffect(() => {
    // Simulando carregamento de dados da API
    setLoading(true);
    setTimeout(() => {
      setClients([
        {
          id: '1',
          name: 'João Silva',
          address: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          phone: '(11) 98765-4321',
          email: 'joao.silva@exemplo.com',
          createdAt: '2023-05-10T14:30:00Z',
          visitsCount: 5
        },
        {
          id: '2',
          name: 'Maria Oliveira',
          address: 'Av. Principal, 456',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '20000-000',
          phone: '(21) 98765-4321',
          email: 'maria.oliveira@exemplo.com',
          createdAt: '2023-06-15T10:45:00Z',
          visitsCount: 3
        },
        {
          id: '3',
          name: 'Carlos Mendes',
          address: 'Rua Secundária, 789',
          city: 'Belo Horizonte',
          state: 'MG',
          zipCode: '30000-000',
          phone: '(31) 98765-4321',
          email: 'carlos.mendes@exemplo.com',
          createdAt: '2023-07-20T09:15:00Z',
          visitsCount: 1
        },
        {
          id: '4',
          name: 'Ana Pereira',
          address: 'Rua das Palmeiras, 321',
          city: 'Curitiba',
          state: 'PR',
          zipCode: '80000-000',
          phone: '(41) 98765-4321',
          email: 'ana.pereira@exemplo.com',
          createdAt: '2023-08-05T16:20:00Z',
          visitsCount: 0
        },
      ]);
      setLoading(false);
    }, 1000);

    // Quando estiver pronto para integrar com a API, descomente o código abaixo
    // const fetchClients = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await api.get('/clients');
    //     setClients(response.data);
    //     setError(null);
    //   } catch (err) {
    //     setError('Erro ao carregar clientes. Por favor, tente novamente.');
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchClients();
  }, []);

  const handleOpenModal = (client = null) => {
    setSelectedClient(client);
    onOpen();
  };

  const handleSaveClient = () => {
    // Implementar lógica para salvar cliente
    toast({
      title: selectedClient ? 'Cliente atualizado' : 'Cliente criado',
      description: `O cliente foi ${selectedClient ? 'atualizado' : 'criado'} com sucesso!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleDeleteClient = (clientId) => {
    // Implementar lógica para excluir cliente
    setClients(clients.filter(client => client.id !== clientId));
    toast({
      title: 'Cliente excluído',
      description: 'O cliente foi excluído com sucesso!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  // Filtrar clientes com base no termo de pesquisa
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <AdminLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Gerenciamento de Clientes</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => handleOpenModal()}>
            Novo Cliente
          </Button>
        </Flex>

        <Flex mb={6} justifyContent="space-between" alignItems="center">
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Buscar por nome, email ou telefone" 
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
                  <Th>Contato</Th>
                  <Th>Localização</Th>
                  <Th>Visitas</Th>
                  <Th>Cadastro</Th>
                  <Th width="100px">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredClients.map((client) => (
                  <Tr key={client.id}>
                    <Td fontWeight="medium">{client.name}</Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" display="flex" alignItems="center">
                          <Icon as={FiPhone} mr={1} color="gray.500" />
                          {client.phone}
                        </Text>
                        <Text fontSize="sm" display="flex" alignItems="center">
                          <Icon as={FiMail} mr={1} color="gray.500" />
                          {client.email}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{client.city}, {client.state}</Text>
                    </Td>
                    <Td>
                      <Badge colorScheme={client.visitsCount > 0 ? 'green' : 'gray'}>
                        {client.visitsCount} {client.visitsCount === 1 ? 'visita' : 'visitas'}
                      </Badge>
                    </Td>
                    <Td>{formatDate(client.createdAt)}</Td>
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
                          <MenuItem icon={<FiEdit2 />} onClick={() => handleOpenModal(client)}>
                            Editar
                          </MenuItem>
                          <MenuItem icon={<FiCalendar />} as={RouterLink} to={`/admin/clients/${client.id}/visits`}>
                            Ver Agendamentos
                          </MenuItem>
                          <Divider />
                          <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDeleteClient(client.id)}>
                            Excluir
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
                {filteredClients.length === 0 && (
                  <Tr>
                    <Td colSpan={6} textAlign="center" py={4}>
                      {searchTerm ? 'Nenhum cliente encontrado para esta pesquisa' : 'Nenhum cliente cadastrado'}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Modal para criar/editar cliente */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedClient ? 'Editar Cliente' : 'Novo Cliente'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input 
                    placeholder="Nome completo" 
                    defaultValue={selectedClient?.name || ''}
                  />
                </FormControl>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Telefone</FormLabel>
                    <Input 
                      placeholder="(00) 00000-0000" 
                      defaultValue={selectedClient?.phone || ''}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      placeholder="email@exemplo.com" 
                      defaultValue={selectedClient?.email || ''}
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Endereço</FormLabel>
                  <Input 
                    placeholder="Rua, número, complemento" 
                    defaultValue={selectedClient?.address || ''}
                  />
                </FormControl>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Cidade</FormLabel>
                    <Input 
                      placeholder="Cidade" 
                      defaultValue={selectedClient?.city || ''}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Estado</FormLabel>
                    <Select 
                      placeholder="Selecione" 
                      defaultValue={selectedClient?.state || ''}
                    >
                      <option value="AC">AC</option>
                      <option value="AL">AL</option>
                      <option value="AP">AP</option>
                      <option value="AM">AM</option>
                      <option value="BA">BA</option>
                      <option value="CE">CE</option>
                      <option value="DF">DF</option>
                      <option value="ES">ES</option>
                      <option value="GO">GO</option>
                      <option value="MA">MA</option>
                      <option value="MT">MT</option>
                      <option value="MS">MS</option>
                      <option value="MG">MG</option>
                      <option value="PA">PA</option>
                      <option value="PB">PB</option>
                      <option value="PR">PR</option>
                      <option value="PE">PE</option>
                      <option value="PI">PI</option>
                      <option value="RJ">RJ</option>
                      <option value="RN">RN</option>
                      <option value="RS">RS</option>
                      <option value="RO">RO</option>
                      <option value="RR">RR</option>
                      <option value="SC">SC</option>
                      <option value="SP">SP</option>
                      <option value="SE">SE</option>
                      <option value="TO">TO</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>CEP</FormLabel>
                    <Input 
                      placeholder="00000-000" 
                      defaultValue={selectedClient?.zipCode || ''}
                    />
                  </FormControl>
                </HStack>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleSaveClient}>
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

export default ClientsPage;