import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

function Signup() {
  const type = new URLSearchParams(useLocation().search).get("type");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = event.target.name.value;
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const phoneNo = event.target.phoneNo.value;

    const response = await fetch(`http://localhost:8080/${type === "seller" ? "sellers" : "buyers"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
        phoneNo,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // redirect to homepage
      navigate("${type}Homepage");
    } else {
      // show error message
      setError("Invalid details. Please try again.");
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
            type="text"
            placeholder=" "
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <FormLabel>Username</FormLabel>
        </FormControl>

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
        <FormControl mt={4} variant="floating">
          <Input
            type="tel"
            placeholder=" "
            value={phoneNo}
            onChange={(event) => setPhoneNo(event.target.value)}
            required
          />
          <FormLabel>Phone Number</FormLabel>
        </FormControl>
        {error && (
          <FormControl>
            <FormLabel color="red.500">{error}</FormLabel>
          </FormControl>
        )}

        <Box mt={4} display="flex" alignItems="center">
          <Button bg="#E2725B" colorScheme="white" type="submit" w="100%">
            Register
          </Button>
        </Box>

        <Box mt={4} display="flex" alignItems="center">
          <Link
            to={`/forgotPassword?type=${type}`}
            style={{ color: "#E2725B", textDecoration: "underline" }}
          >
            Forgot password?
          </Link>
        </Box>

        <Box
          maxW="xl"
          mx="auto"
          mt={20}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text marginRight="2">Have an account?</Text>
          <Link
            to={`/login?type=${type}`}
            style={{ color: "#E2725B", textDecoration: "underline" }}
          >
            Sign in here!
          </Link>
        </Box>
      </form>
    </Box>
  );
}

export default Signup;
