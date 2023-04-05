import { React, useEffect, useState } from "react";
import "./resources/profile.css";

import { SellerNavigationBar } from "../components/sellerNavigationBar";
import { SellerCalendar } from "../components/sellerCalendar.js";

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
import { FaEdit } from "react-icons/fa";

function SellerAppointments() {
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

  const routeChangeToEditAccountDetails = (buyerId) => {
    console.log("routeChangeToEditAccountDetails: ", buyerId);
    let path = "/buyerEditAccount/";
    navigate(path + buyerId);
  };

  return (
    <div className="background">
      <NavigationBar />
      <SellerCalendar />
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
          <div
            className="button1"
            onClick={() => routeChangeToEditAccountDetails()}
          >
            Edit Account Details
            <FaEdit />
          </div>
        </Flex>
      </Flex>
      <h2>Search for order:</h2>
      <div class="searchBar">
        <input
          className="input"
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
          }}
        />
        <button className="button">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>
      <div class="ordersDisplay">
        {orders.map((order) => (
          <div id="orderCard" onClick={() => routeChangeToOrder(order.id)}>
            <div className="productImg">
              <img
                className="productImg"
                src={require("../assets/scones.jpg")}
                alt="listing product"
              />
            </div>
            <div id="orderDetailsGrid">
              <div className="orderDetails_top">
                <h2>{order.title}</h2>
                <h4 className="details">details</h4>
                <h4 className="italic">more details</h4>
              </div>
              <div className="orderDetails_bottom">
                <h2>{order.status}</h2>
                <h2>${order.price}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerAppointments;
