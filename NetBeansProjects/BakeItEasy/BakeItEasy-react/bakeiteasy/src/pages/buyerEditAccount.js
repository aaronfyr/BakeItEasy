import { React, useEffect, useState } from "react";
import "./resources/profile.css";

import { NavigationBar } from "../components/buyerNavigationBar";

import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { FaEdit, FaArrowRight } from "react-icons/fa";

function BuyerEditAccount() {
  const [buyer, setBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState("Log In");
  const [buyerId, setBuyerId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedBuyer = localStorage.getItem("buyer");
      if (!fetchedBuyer) {
        console.log("profile", "no buyer");
        navigate("/login");
      } else {
        console.log("profile", "has buyer");
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.name: ", parsedUser.name);
          setBuyerName(parsedUser.name);
          setBuyerId(parsedUser.buyerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  const [orders, setOrders] = useState([]);
  console.log("buyerId:", buyerId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let buyerId = null;
        const fetchedBuyer = localStorage.getItem("buyer");
        if (!fetchedBuyer) {
          console.log("profile", "no buyer");
          navigate("/login");
        } else {
          const parsedUser = JSON.parse(fetchedBuyer);
          buyerId = parsedUser.buyerId;
          console.log("buyerId to get orders", buyerId);
        }

        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/orders/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setOrders(data);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, []);

  const { id } = useParams();

  const [search, setSearch] = useState("");

  let navigate = useNavigate();
  const routeChangeToOrder = (id) => {
    let path = "/buyerOrder/";
    navigate(path + id);
  };

  // if user is not logged in, redirects to homepage
  /*
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.type === "seller") {
        setSeller(parsedUser);
      } else {
        setBuyer(parsedUser);
      }
    } else {
      navigate("/login");
    }
  }, []);
  */

  // handleSubmitUpdateUsername
  const [username, setUsername] = useState("");

  const handleSubmitUpdateUsername = async (event) => {
    event.preventDefault();
  };

  const routeChangeToProfile = (buyerId) => {
    console.log("routeChangeToProfile: ", buyerId);
    let path = "/buyerProfile/";
    navigate(path + buyerId);
  };

  return (
    <div className="background">
      <NavigationBar />
      <div id="coverPhoto">
        <div id="profilePhoto"></div>
      </div>
      <Flex justifyContent={"space-between"}>
        <div id="userDetails">
          <h1>{buyerName}</h1>

          <Popup trigger={<FaEdit />} modal nested>
            {(close) => (
              <div className="modal">
                <button className="close" onClick={close}>
                  &times;
                </button>
                <div className="header"> Update Username </div>
                <div className="content">
                  <form onSubmit={handleSubmitUpdateUsername}>
                    <FormControl mt={4}>
                      <FormLabel>New username: </FormLabel>
                      <Input
                        type="text"
                        placeholder=" "
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                      />
                    </FormControl>
                    <Box mt={4} display="flex" alignItems="center">
                      <Button
                        bg="#E2725B"
                        colorScheme="white"
                        type="submit"
                        w="100%"
                      >
                        Confirm New Username
                      </Button>
                    </Box>
                  </form>
                </div>
              </div>
            )}
          </Popup>
          <h4>details</h4>
        </div>
        <Flex>
          <div className="button1" onClick={() => routeChangeToProfile()}>
            Back to Profile
            <FaArrowRight />
          </div>
        </Flex>
      </Flex>
    </div>
  );
}

export default BuyerEditAccount;
