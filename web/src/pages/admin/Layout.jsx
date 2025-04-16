import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Avatar,
  VStack,
  HStack,
  Heading,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Divider,
  Icon,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiTool,
  FiClipboard,
  FiPieChart,
  FiSettings,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';

const SidebarContent = ({ onClose, ...rest }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/admin/dashboard' },
    { name: 'Calendário', icon: FiCalendar, path: '/admin/calendar' },
    { name: 'Clientes', icon: FiUsers, path: '/admin/clients' },
    { name: 'Equipes', icon: FiUserCheck, path: '/admin/teams' },
    { name: 'Serviços', icon: FiTool, path: '/admin/services' },
    { name: 'Agendamentos', icon: FiClipboard, path: '/admin/visits' },
    { name: 'Relatórios', icon: FiPieChart, path: '/admin/reports' },
    { name: 'Configurações', icon: FiSettings, path: '/admin/settings' },
  ];

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Heading fontSize="2xl" fontWeight="bold">
          Agendamento
        </Heading>
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onClose}
          variant="outline"
          aria-label="Fechar menu"
          icon={<FiMenu />}
        />
      </Flex>
      <VStack spacing={1} align="stretch" px={3}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              as={RouterLink}
              to={item.path}
              key={item.name}
              _hover={{ textDecoration: 'none' }}
            >
              <Flex
                align="center"
                p="4"
                mx="1"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bg={isActive ? 'blue.500' : 'transparent'}
                color={isActive ? 'white' : 'inherit'}
                _hover={{
                  bg: isActive ? 'blue.600' : 'blue.50',
                  color: isActive ? 'white' : 'blue.500',
                }}
              >
                <Icon
                  mr="4"
                  fontSize="16"
                  as={item.icon}
                />
                {item.name}
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
};

const AdminLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
      <SidebarContent onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody p={0}>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Navbar */}
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 6 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent="space-between"
      >
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          variant="outline"
          aria-label="Abrir menu"
          icon={<FiMenu />}
        />

        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontWeight="bold"
        >
          Agendamento
        </Text>

        <HStack spacing={4}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack spacing={2}>
                <Avatar
                  size="sm"
                  name={user?.name || 'Admin'}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing={0}
                  ml="2"
                >
                  <Text fontSize="sm">{user?.name || 'Admin'}</Text>
                  <Text fontSize="xs" color="gray.600">
                    Administrador
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem icon={<FiSettings />}>Perfil</MenuItem>
              <MenuItem icon={<FiSettings />}>Configurações</MenuItem>
              <Divider />
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                Sair
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Conteúdo principal */}
      <Box ml={{ base: 0, md: 60 }} p={0}>
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;