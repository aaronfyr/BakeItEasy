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

    const email = event.target.email.value;
    const password = event.target.password.value;

    const response = await fetch(`http://localhost:8080/admins/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (response.ok) {
      setIsLoading(false);
      const user = await response.json();
      localStorage.setItem("user", user);
      console.log(user);
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
