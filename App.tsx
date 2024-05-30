import * as React from 'react';
import { ChakraProvider, Container, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  LoginPage  from './components/login/login-form';
import RegistrationForm from './components/register/register-form';
import  UserPage from './components/profile/profile';

export const App = () => (
  <ChakraProvider>
    <Router>
        <Container maxWidth="7xl">
          <Flex justifyContent="space-between" marginBottom="4" alignItems="center">
          </Flex>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/register" element={<RegistrationForm />} />
          </Routes>
          <Flex paddingY="6" backgroundColor="background.medium" justifyContent="center">
          </Flex>
        </Container>
    </Router>
  </ChakraProvider>
);