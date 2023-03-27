import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AdminContext } from "../context/adminProvider";

function AdminLogin() {
  const navigate = useNavigate();
  const { setAdmin } = useContext(AdminContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const response = await fetch(`http://localhost:8080/admins/login`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      setAdmin(user);
      // redirect to homepage
      navigate(`viewAllReports`);
    } else {
      // show error message
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <Box
      maxW="xl"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      h="xl"
      marginTop="10%"
    >
      <Box align="center">
        <img
          width="50px"
          height="50px"
          hspace="30px"
          src={require("../assets/bakeiteasy-logo.png")}
          alt="BakeItEasy"
        ></img>
        <div className="logo">BakeItEasy</div>
      </Box>

      <form onSubmit={handleSubmit}>
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
            Log in
          </Button>
        </Box>
      </form>

      <Image
        src={require("../assets/Lady.png")}
        borderRadius="ml"
        position="absolute"
        bottom="39"
        right="400"
        maxWidth="250px"
      />
    </Box>
  );
}

export default AdminLogin;
