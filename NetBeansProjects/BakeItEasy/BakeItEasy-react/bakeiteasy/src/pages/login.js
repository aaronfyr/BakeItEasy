import { FormControl, FormLabel, Input, Button, Box } from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Login() {
  const type = new URLSearchParams(useLocation().search).get("type");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const response = await fetch(`http://localhost:8080/${type}Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // redirect to homepage
      navigate("${type}Homepage");
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
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </FormControl>
        {error && (
          <FormControl>
            <FormLabel color="red.500">{error}</FormLabel>
          </FormControl>
        )}
        <Button mt={4} colorScheme="teal" type="submit">
          Login
        </Button>
        <Box mt={2}>
          <Link to={`/forgotPassword?type=${type}`} color="teal.500" display="block">
            Forgot password?
          </Link>
          <Box mt={2}>
            <Link to={`/signup?type=${type}`} color="teal.500" display="block">
              Sign up here!
            </Link>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default Login;
