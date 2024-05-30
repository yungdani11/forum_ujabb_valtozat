import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, Alert, AlertIcon, FormErrorMessage } from '@chakra-ui/react';

const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().email('Érvénytelen email cím').required('Kötelező mező'),
    password: Yup.string()
      .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie, 1 számmal és 1 kisbetűvel')
      .matches(/\d/, 'A jelszónak tartalmaznia kell legalább egy számot')
      .matches(/[a-z]/, 'A jelszónak tartalmaznia kell legalább egy kisbetűt')
      .required('Kötelező mező'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        const response = await fetch('http://localhost:5000/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.accessToken);
          navigate('/profile');
        } else if (response.status === 400) {
          setError('Hibás adatok');
        } else if (response.status === 401) {
          setError('Hibás felhasználónév vagy jelszó');
        }
      } catch (error) {
        console.error('Hálózati hiba:', error);
        setError('Hálózati hiba');
      }
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };

  return (
    <Box maxW="400px" m="auto" mt="50px" p="4" borderWidth="1px" borderRadius="lg">
      <Box as="form" onSubmit={formik.handleSubmit}>
        <FormControl id="username" isInvalid={formik.touched.username && !!formik.errors.username} isRequired>
          <FormLabel>Felhasználónév (E-mail)</FormLabel>
          <Input
            type="email"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl id="password" mt="4" isInvalid={formik.touched.password && !!formik.errors.password} isRequired>
          <FormLabel>Jelszó</FormLabel>
          <Input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          )}
        </FormControl>
        {error && (
          <Alert status="error" mt="4">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Button colorScheme="blue" mt="4" type="submit" isDisabled={formik.isSubmitting || !formik.isValid}>
          Belépés
        </Button>
        <Button variant="outline" mt="4" marginLeft={50} onClick={handleReset}>
            Mégsem
          </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
