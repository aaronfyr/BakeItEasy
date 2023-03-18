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
          <FormLabel>Email address</FormLabel>
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

export default ForgotPassword;
