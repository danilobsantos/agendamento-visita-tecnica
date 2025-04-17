import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Image,
  Flex,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  SlideFade,
  ScaleFade,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const { login } = useAuth();
  const toast = useToast();

  // Cores dinâmicas baseadas no modo de cor
  // const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const highlightColor = useColorModeValue('blue.500', 'blue.300');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange', // Validação em tempo real
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        // Mensagens de erro mais específicas para credenciais inválidas
        let errorMessage = result.message;
        if (errorMessage.includes('credenciais') || 
            errorMessage.includes('senha') || 
            errorMessage.includes('email') || 
            errorMessage.includes('usuário')) {
          errorMessage = 'Email ou senha incorretos. Por favor, verifique suas credenciais.';
        }
        
        setLoginError(errorMessage);
        toast({
          title: 'Erro de autenticação',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top',
        });
      } else {
        // Feedback positivo
        toast({
          title: 'Login realizado com sucesso',
          description: 'Redirecionando para o dashboard...',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
        
        // Redirecionar com base no papel do usuário
        const { userData } = result;
        setTimeout(() => {
          if (userData.role === 'ADMIN') {
            window.location.href = '/admin/dashboard';
          } else if (userData.role === 'SELLER') {
            window.location.href = '/seller/dashboard';
          } else {
            window.location.href = '/field-team/dashboard';
          }
        }, 1000); // Pequeno delay para mostrar o toast
      }
    } catch {
      const errorMessage = 'Ocorreu um erro ao tentar fazer login. Verifique suas credenciais.';
      setLoginError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minHeight="100vh"
      minWidth="100vw"
      align="center"
      justifyContent="center"
      bgImage="url('/login-background.svg')"
      bgSize="cover"
      bgPosition="center"
    >
      <Container maxW="md" py={8}>
        <ScaleFade initialScale={0.9} in={true}>
          <Box
            p={8}
            borderWidth={1}
            borderRadius="xl"
            boxShadow="2xl"
            bg={useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)')}
            color={textColor}
            borderColor={borderColor}
            backdropFilter="blur(10px)"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: '2xl' }}
          >
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Image
                src="/logo.svg"
                alt="Logo"
                fallbackSrc="https://via.placeholder.com/150?text=Agendamento"
                boxSize="100px"
                mx="auto"
                mb={4}
                animation="pulse 2s infinite"
                _hover={{ transform: 'scale(1.05)' }}
                transition="all 0.3s ease"
              />
              <Heading size="lg" bgGradient="linear(to-r, blue.400, blue.600)" bgClip="text" fontWeight="extrabold">
                Sistema de Agendamento
              </Heading>
              <Text mt={3} color={useColorModeValue('gray.600', 'gray.300')} fontSize="sm" fontWeight="medium">
                Entre com suas credenciais para acessar o sistema
              </Text>
            </Box>

            <Divider />

            {loginError && (
              <SlideFade in={!!loginError} offsetY="20px">
                <Alert 
                  status="error" 
                  borderRadius="md" 
                  variant="solid" 
                  colorScheme="red"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  py={3}
                >
                  <AlertIcon boxSize={5} />
                  <AlertDescription fontSize="sm" fontWeight="medium">{loginError}</AlertDescription>
                </Alert>
              </SlideFade>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontWeight="medium">Email</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      {...register('email')}
                      focusBorderColor={highlightColor}
                      _hover={{ borderColor: highlightColor }}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderWidth="1px"
                      transition="all 0.3s"
                    />
                    <InputRightElement>
                      <FiUser color={useColorModeValue('gray.400', 'gray.300')} />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.email?.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontWeight="medium">Senha</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="******"
                      {...register('password')}
                      focusBorderColor={highlightColor}
                      _hover={{ borderColor: highlightColor }}
                      bg={useColorModeValue('white', 'gray.700')}
                      borderWidth="1px"
                      transition="all 0.3s"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                        size="sm"
                        color={useColorModeValue('gray.400', 'gray.300')}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  mt={6}
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Entrando..."
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  _active={{ transform: 'scale(0.98)' }}
                  transition="all 0.2s"
                  fontWeight="bold"
                  bgGradient="linear(to-r, blue.400, blue.600)"
                >
                  Entrar
                </Button>
              </VStack>
            </form>

            <Text fontSize="xs" textAlign="center" color={useColorModeValue('gray.500', 'gray.400')} mt={6}>
              © {new Date().getFullYear()} Sistema de Agendamento. Todos os direitos reservados.
            </Text>
          </VStack>
          </Box>
        </ScaleFade>
      </Container>
    </Flex>
  );
};

export default Login;