import { FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';

function BuyerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const response = await fetch("http://localhost:8080/buyerLogin", {
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
      // redirect to BuyerHomepage component
      navigate("/buyerhomepage");
    } else {
      // show error message
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <FormControl>
      <FormLabel>Email address</FormLabel>
      <Input type="email" placeholder="Enter email" />
      <FormLabel>Password</FormLabel>
      <Input type="password" placeholder="Enter password" />
      <Button mt={4} colorScheme="teal" type="submit">
        Login
      </Button>
    </FormControl>
  );
}

export default BuyerLogin;
