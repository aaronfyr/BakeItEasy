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
import { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BuyerContext } from "../context/buyerProvider";
import { SellerContext } from "../context/sellerProvider";
import "./resources/login.css";

function Login() {
  const [isLoading, setIsLoading] = useState(null);

  const type = new URLSearchParams(useLocation().search).get("type");
  const navigate = useNavigate();
  const { setBuyer } = useContext(BuyerContext);
  const { setSeller } = useContext(SellerContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/${
        type === "seller" ? "sellers" : "buyers"
      }/${email}/${password}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("handle submit", "");

    if (response.ok) {
      setIsLoading(false);
      const user = await response.json();
      if (type === "seller") {
        setSeller(user);
        localStorage.setItem("seller", JSON.stringify(user));
        console.log("seller set: ", user);
        navigate(`/sellerProfile`);
      } else {
        setBuyer(user);
        localStorage.setItem("buyer", JSON.stringify(user));
        console.log("buyer set: ", user);
        navigate(`/`);
      }
    } else {
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  /*
  useEffect(() => {
    console.log("fetchBuyer useEffect", "");
    async function fetchBuyer() {
      const buyer = localStorage.getItem("buyer");
      if (buyer) {
        console.log("useEffect detect: ", "buyer present");
        navigate(`/`);
      }
    }
    fetchBuyer();
  }, []);
*/

  const handlePortalSwitch = () => {
    // navigate to a different page when the button is clicked
    navigate(`/login?type=${type === "seller" ? "buyer" : "seller"}`);
  };

  const handleHomepageReturn = () => {
    // navigate to a different page when the button is clicked
    navigate(`${type === "seller" ? "/sellerHomepage" : "/"}`);
  };

  return (
    <>
      <ToastContainer />
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

      <Box
        maxW="xl"
        mx="auto"
        justifyContent="center"
        alignItems="center"
        h="xl"
        marginTop="10%"
        position="relative"
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
          bottom="100"
          right="-175"
          maxWidth="250px"
        />
      </Box>
    </>
  );
}

export default Login;
