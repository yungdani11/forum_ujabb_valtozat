import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Alert, AlertIcon, useToast } from '@chakra-ui/react';
import * as Yup from 'yup';

interface FormValues {
  username: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
}

const validationSchema = Yup.object({
  username: Yup.string().email('Érvényes email címet kell megadni').required('Kötelező kitölteni'),
  password: Yup.string().min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie,1 számmal és 1 kisbetűvel')
    .matches(/[0-9]/, 'Legalább 1 számot kell tartalmaznia')
    .matches(/[a-z]/, 'Legalább 1 kisbetűt kell tartalmaznia')
    .required('Kötelező kitölteni'),
  passwordConfirm: Yup.string().oneOf([Yup.ref('password'), ''], 'A jelszó nem egyezik')
    .required('Kötelező kitölteni'),
  firstName: Yup.string().required('Kötelező kitölteni'),
  lastName: Yup.string().required('Kötelező kitölteni'),
});

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const unknownErrorMessage = 'Ismeretlen hiba történt.';

  const formik = useFormik<FormValues>({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
      firstName: '',
      lastName: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          const userData = await response.json();

          localStorage.setItem('userData', JSON.stringify(userData));

          toast({
            title: 'Sikeres regisztráció!',
            description: 'Most már bejelentkezhet.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
          resetForm();
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else if (response.status === 400) {
          const errorData = await response.json();
          toast({
            title: 'Hiba',
            description: 'A bevitt adatok érvénytelenek.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        } else if (response.status === 409) {
          const errorData = await response.json();
          toast({
            title: 'Hiba',
            description:  'A felhasználó már létezik.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        } else {
          throw new Error(unknownErrorMessage);
        }
      } catch (error) {
        toast({
          title: 'Hiba',
          description: error instanceof Error ? error.message : unknownErrorMessage,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box w="100%" maxW="md" mx="auto" mt={20} p={3} boxShadow="md" borderRadius="md" bg="gray.900">
      <Heading mb={6} textAlign="center" color="white">Regisztráció</Heading>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          {[
            { name: 'username', type: 'email', label: 'Email cím' },
            { name: 'password', type: 'password', label: 'Jelszó' },
            { name: 'passwordConfirm', type: 'password', label: 'Jelszó megerősítése' },
            { name: 'firstName', type: 'text', label: 'Keresztnév' },
            { name: 'lastName', type: 'text', label: 'Vezetéknév' },
          ].map(({ name, type, label }) => (
            <FormControl key={name} isInvalid={formik.touched[name as keyof FormValues] && !!formik.errors[name as keyof FormValues]}>
              <FormLabel htmlFor={name} color="white">{label}</FormLabel>
              <Input
                id={name}
                name={name}
                type={type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name as keyof FormValues]}
                bg="gray.700"
                borderColor="gray.600"
                color="white"
              />
              {formik.touched[name as keyof FormValues] && formik.errors[name as keyof FormValues] && (
                <Alert status="error" mt={1} borderRadius="md">
                  <AlertIcon />
                  {formik.errors[name as keyof FormValues]}
                </Alert>
              )}
            </FormControl>
          ))}
          <Button colorScheme="black" type="submit" width="100%" isDisabled={!formik.isValid || formik.isSubmitting}>
            Regisztráció
          </Button>
          <Button colorScheme="black" type="button" width="100%" onClick={() => formik.resetForm()} isDisabled={isLoading}>
            Mégsem
          </Button>
        </VStack>
      </form>
    </Box>
  );
};


export default RegistrationForm;
