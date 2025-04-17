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
  AlertIcon
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiUserPlus, FiUsers } from 'react-icons/fi';
import AdminLayout from './Layout';
import { adminService } from '../../services/adminService';
// import { api } from '../../services/api'; // Descomente quando estiver pronto para integrar com a API

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await adminService.getTeams();
        setTeams(response);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar equipes. Por favor, tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const handleOpenModal = (team = null) => {
    setSelectedTeam(team);
    onOpen();
  };

  const handleSaveTeam = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const teamData = {
      name: formData.get('teamName')
    };

    try {
      if (selectedTeam) {
        await adminService.updateTeam(selectedTeam.id, teamData);
      } else {
        await adminService.createTeam(teamData);
      }

      const updatedTeams = await adminService.getTeams();
      setTeams(updatedTeams);

      toast({
        title: selectedTeam ? 'Equipe atualizada' : 'Equipe criada',
        description: `A equipe foi ${selectedTeam ? 'atualizada' : 'criada'} com sucesso!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch {
      toast({
        title: 'Erro',
        description: `Erro ao ${selectedTeam ? 'atualizar' : 'criar'} equipe. Por favor, tente novamente.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTeam = (teamId) => {
    // Implementar lógica para excluir equipe
    setTeams(teams.filter(team => team.id !== teamId));
    toast({
      title: 'Equipe excluída',
      description: 'A equipe foi excluída com sucesso!',
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

  return (
    <AdminLayout>
      <Box p={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Gerenciamento de Equipes</Heading>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => handleOpenModal()}>
            Nova Equipe
          </Button>
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
                  <Th>Nome da Equipe</Th>
                  <Th>Membros</Th>
                  <Th>Data de Criação</Th>
                  <Th width="100px">Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {teams.map((team) => (
                  <Tr key={team.id}>
                    <Td fontWeight="medium">{team.name}</Td>
                    <Td>
                      <HStack>
                        <Badge colorScheme="blue">{team.members.length}</Badge>
                        <Text fontSize="sm">{team.members.length === 1 ? 'membro' : 'membros'}</Text>
                      </HStack>
                    </Td>
                    <Td>{formatDate(team.createdAt)}</Td>
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
                          <MenuItem icon={<FiEdit2 />} onClick={() => handleOpenModal(team)}>
                            Editar
                          </MenuItem>
                          <MenuItem icon={<FiUserPlus />}>
                            Gerenciar Membros
                          </MenuItem>
                          <Divider />
                          <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDeleteTeam(team.id)}>
                            Excluir
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
                {teams.length === 0 && (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={4}>
                      Nenhuma equipe encontrada
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Modal para criar/editar equipe */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedTeam ? 'Editar Equipe' : 'Nova Equipe'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <form id="teamForm" onSubmit={handleSaveTeam}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Nome da Equipe</FormLabel>
                    <Input 
                      name="teamName"
                      placeholder="Nome da equipe" 
                      defaultValue={selectedTeam?.name || ''}
                    />
                </FormControl>

                {selectedTeam && (
                  <Box>
                    <FormLabel mb={2}>Membros da Equipe</FormLabel>
                    <Box borderWidth="1px" borderRadius="md" p={3}>
                      {selectedTeam.members.length > 0 ? (
                        <VStack align="stretch" spacing={2}>
                          {selectedTeam.members.map(member => (
                            <Flex key={member.id} justify="space-between" align="center">
                              <Text fontSize="sm">{member.name}</Text>
                              <Text fontSize="xs" color="gray.500">{member.email}</Text>
                            </Flex>
                          ))}
                        </VStack>
                      ) : (
                        <Text fontSize="sm" color="gray.500">Nenhum membro nesta equipe</Text>
                      )}
                    </Box>
                    <Button 
                      leftIcon={<FiUserPlus />} 
                      variant="outline" 
                      size="sm" 
                      mt={2}
                      colorScheme="blue"
                    >
                      Adicionar Membros
                    </Button>
                  </Box>
                )}
              </VStack>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button type="submit" form="teamForm" colorScheme="blue" mr={3}>
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

export default TeamsPage;