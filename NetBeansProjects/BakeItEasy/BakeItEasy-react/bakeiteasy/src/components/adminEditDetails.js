import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
  Image,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function AdminEditDetails({
  id,
  name: adminName,
  email: adminEmail,
  password: adminPassword,
}) {
  const [isLoading, setIsLoading] = useState(null);

  const navigate = useNavigate();

  const [name, setName] = useState(adminName);
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState(adminPassword);
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(adminName);
    setEmail(adminEmail);
    setPassword(adminPassword);
  }, [adminName, adminEmail, adminPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const admin = await response.json();
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      // show error message
      setError("Invalid details. Please try again.");
    }
  };

  return (
    <>
      <Box
        maxW="xl"
        mx="auto"
        justifyContent="center"
        alignItems="center"
        h="xl"
        marginTop="10%"
        position="relative"
      >
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" mb={8}>
            Edit Your Details
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl mt={4} variant="floating">
            <Input
              type="text"
              placeholder=" "
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
            <FormLabel>Name</FormLabel>
          </FormControl>
          <FormControl mt={4} variant="floating">
            <Input
              type="email"
              placeholder=" "
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <FormLabel>Email</FormLabel>
          </FormControl>
          <FormControl mt={4} variant="floating">
            <Input
              type="password"
              placeholder=" "
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <FormLabel>Password</FormLabel>
          </FormControl>
          {error && (
            <FormControl>
              <FormLabel color="red.500">{error}</FormLabel>
            </FormControl>
          )}

          <Box mt={4} display="flex" alignItems="center">
            <Button bg="#E2725B" colorScheme="white" type="submit" w="100%">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default AdminEditDetails;
