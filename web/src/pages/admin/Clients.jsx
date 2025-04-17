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
  Select,
  Icon
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiSearch, FiUser, FiMapPin, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';
import AdminLayout from './Layout';
import { adminService } from '../../services/adminService';
// import { api } from '../../services/api'; // Descomente quando estiver pronto para integrar com a API
import { Link as RouterLink } from 'react-router-dom';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await adminService.getClients();
        setClients(response);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar clientes. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleOpenModal = (client = null) => {
    setSelectedClient(client);
    onOpen();
  };

  const handleSaveClient = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const clientData = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode')
    };

    try {
      if (selectedClient) {
        await adminService.updateClient(selectedClient.id, clientData);
      } else {
        await adminService.createClient(clientData);
      }

      const updatedClients = await adminService.getClients();
      setClients(updatedClients);

      toast({
        title: selectedClient ? 'Cliente atualizado' : 'Cliente criado',
        description: `O cliente foi ${selectedClient ? 'atualizado' : 'criado'} com sucesso!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Erro',
        description: `Erro ao ${selectedClient ? 'atualizar' : 'criar'} cliente. Por favor, tente novamente.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
            <form onSubmit={handleSaveClient}>
              <ModalBody pb={6}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Nome</FormLabel>
                    <Input 
                      name="name"
                      placeholder="Nome completo" 
                      defaultValue={selectedClient?.name || ''}
                    />
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Telefone</FormLabel>
                      <Input 
                        name="phone"
                        placeholder="(00) 00000-0000" 
                        defaultValue={selectedClient?.phone || ''}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        name="email"
                        type="email" 
                        placeholder="email@exemplo.com" 
                        defaultValue={selectedClient?.email || ''}
                      />
                    </FormControl>
                  </HStack>

                  <FormControl isRequired>
                    <FormLabel>Endereço</FormLabel>
                    <Input 
                      name="address"
                      placeholder="Rua, número, complemento" 
                      defaultValue={selectedClient?.address || ''}
                    />
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Cidade</FormLabel>
                      <Input 
                        name="city"
                        placeholder="Cidade" 
                        defaultValue={selectedClient?.city || ''}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Estado</FormLabel>
                      <Select 
                        name="state"
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
                        name="zipCode"
                        placeholder="00000-000" 
                        defaultValue={selectedClient?.zipCode || ''}
                      />
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

export default ClientsPage;