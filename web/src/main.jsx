import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'
import Routes from './routes'
import { queryClient } from './lib/queryClient'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Routes />
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>,
)
