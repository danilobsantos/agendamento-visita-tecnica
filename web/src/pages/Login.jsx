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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        toast({
          title: 'Erro de autenticação',
          description: result.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        // Redirecionar com base no papel do usuário
        const { userData } = result;
        if (userData.role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else if (userData.role === 'SELLER') {
          window.location.href = '/seller/dashboard';
        } else {
          window.location.href = '/field-team/dashboard';
        }
      }
    } catch {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao tentar fazer login',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        color="gray.700"
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="lg">Sistema de Agendamento</Heading>
            <Text mt={2} color="gray.500">
              Entre com suas credenciais para acessar
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                />
                <FormErrorMessage>
                  {errors.email?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="******"
                    {...register('password')}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                      icon={showPassword ? <FiEyeOff /> : <FiEye />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
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
                mt={4}
                isLoading={isLoading}
              >
                Entrar
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;