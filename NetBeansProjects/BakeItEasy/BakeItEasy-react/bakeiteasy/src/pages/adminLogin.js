import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Image,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/${email}/${password}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const admin = await response.json();
      localStorage.setItem("admin", JSON.stringify(admin));
      navigate(`/viewAllReports`);
    } else {
      const errorData = await response.json();
      toast.error(errorData.error);
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
      <ToastContainer />
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
