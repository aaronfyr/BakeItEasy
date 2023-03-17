import { FormControl, FormLabel, Input, Button, Box } from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function ForgotPassword() {
  const type = new URLSearchParams(useLocation().search).get("type");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;

    const response = await fetch(
      `http://localhost:8080/forget${type}Password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    if (response.ok) {
      setSuccess("Please check your email for further instructions.");
      setError(null);
    } else {
      setError("Invalid email. Please try again.");
      setSuccess(null);
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
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
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

export default ForgotPassword;
