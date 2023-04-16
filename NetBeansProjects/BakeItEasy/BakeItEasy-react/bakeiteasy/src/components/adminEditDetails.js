import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminEditDetails({
  id,
  name: adminName,
  email: adminEmail,
  password: adminPassword,
}) {
  const [name, setName] = useState(adminName);
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState(adminPassword);

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
      const admin = await response.json();
      localStorage.setItem("admin", JSON.stringify(admin));
      toast.success("Details saved!");
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  return (
    <>
      <ToastContainer />
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
              maxLength={128}
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
              maxLength={128}
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
              maxLength={64}
            />
            <FormLabel>Password</FormLabel>
          </FormControl>

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
