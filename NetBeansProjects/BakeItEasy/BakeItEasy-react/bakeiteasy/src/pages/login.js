import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  Text,
  Image,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { BuyerContext } from "../api/buyerProvider";
import { SellerContext } from "../api/sellerProvider";

function Login() {
  const type = new URLSearchParams(useLocation().search).get("type");
  const navigate = useNavigate();
  const { setBuyer } = useContext(BuyerContext);
  const { setSeller } = useContext(SellerContext);

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
      const user = await response.json();
      if (type === "seller") {
        setSeller(user);
      } else {
        setBuyer(user);
      }
      // redirect to homepage
      navigate(`${type}Homepage`);
    } else {
      // show error message
      setError("Invalid login credentials. Please try again.");
    }
  };

  const handlePortalSwitch = () => {
    // navigate to a different page when the button is clicked
    navigate(`/login?type=${type === "seller" ? "buyer" : "seller"}`);
  };

  const handleHomepageReturn = () => {
    // navigate to a different page when the button is clicked
    navigate(`${type === "seller" ? "/sellerHomepage" : "/"}`);
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
      <Button
        position="absolute"
        top="20"
        right="20"
        size="lg"
        mr="4"
        variant="outline"
        color="#E2725B"
        borderColor="#E2725B"
        borderRadius="30px 30px 30px 30px"
        onClick={handlePortalSwitch}
      >
        {type === "seller" ? "for Buyers" : "for Bakers"}
      </Button>

      <Button
        position="absolute"
        top="20"
        left="20"
        size="lg"
        mr="4"
        variant="outline"
        color="#E2725B"
        borderColor="#E2725B"
        borderRadius="30px 30px 30px 30px"
        onClick={handleHomepageReturn}
      >
        To Homepage
      </Button>

      <Box align="center">
        <img
          width="50px"
          height="50px"
          hspace="30px"
          src={require("../assets/bakeiteasy-logo.png")}
          alt="BakeItEasy"
        ></img>
        <div className="logo">BakeItEasy</div>
        <div className="logo">{type === "seller" ? " \nBAKERS" : ""}</div>
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
          <Text marginRight="2">No account with us?</Text>
          <Link
            to={`/signup?type=${type}`}
            style={{ color: "#E2725B", textDecoration: "underline" }}
          >
            Sign up here!
          </Link>
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

export default Login;
