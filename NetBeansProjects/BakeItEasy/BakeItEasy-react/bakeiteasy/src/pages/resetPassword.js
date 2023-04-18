import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPassword() {
  const params = new URLSearchParams(useLocation().search);
  const type = params.get("type");
  const id = params.get("id");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    const response = await fetch(`http://localhost:8080/reset${type}Password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        confirmPassword,
        id,
      }),
    });

    if (response.ok) {
      //const data = await response.json();
      navigate(`/login?type=${type}`);
    } else {
      setError("Passwords do not match. Please try again.");
    }
  };

  // page
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
            type="password"
            placeholder=" "
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <FormLabel>Password</FormLabel>
        </FormControl>
        <FormControl
          mt={4}
          variant="floating"
          isInvalid={password !== confirmPassword}
        >
          <Input
            type="password"
            placeholder=" "
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <FormLabel>Confirm Password</FormLabel>
          {password !== confirmPassword && (
            <FormErrorMessage>Passwords do not match</FormErrorMessage>
          )}
        </FormControl>

        {error && (
          <FormControl>
            <FormLabel color="red.500">{error}</FormLabel>
          </FormControl>
        )}

        <Box mt={4} display="flex" alignItems="center">
          <Button bg="#E2725B" colorScheme="white" type="submit" w="100%">
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default ResetPassword;
