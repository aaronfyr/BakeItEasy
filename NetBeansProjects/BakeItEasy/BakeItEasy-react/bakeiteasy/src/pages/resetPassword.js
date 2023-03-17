import { FormControl, FormLabel, Input, Button, Box } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    const response = await fetch("http://localhost:8080/resettPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        confirmPassword,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // redirect
      navigate("/buyerLogin");
    } else {
      // show error message
      setError("Invalid login credentials. Please try again.");
    }
  };


  // Get token to compare
  // const headers = {
  //   Authorization: `Bearer ${token}`,
  //   "Content-Type": "application/json",
  // };

  // fetch(url, {
  //   method: "GET",
  //   headers: headers,
  // })
  //   .then((response) => response.json())
  //   .then((data) => console.log(data))
  //   .catch((error) => console.error(error));



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
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </FormControl>
        {error && (
          <FormControl>
            <FormLabel color="red.500">{error}</FormLabel>
          </FormControl>
        )}
        <Button mt={4} colorScheme="teal" type="submit">
          Reset
        </Button>
      </form>
    </Box>
  );
  
}

export default ResetPassword;
