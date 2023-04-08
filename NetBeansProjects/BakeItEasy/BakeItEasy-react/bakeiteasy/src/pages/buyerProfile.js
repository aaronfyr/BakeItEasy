import { React, useEffect, useState } from "react";
import "./resources/profile.css";
import {toast, ToastContainer} from "react-toastify";
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
import { FaEdit } from "react-icons/fa";

function BuyerProfile() {
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

  /*
  const [orders, setOrders] = useState([
    {
      id: 1,
      title: "Strawberry Shortcake",
      category: "Cake",
      price: "60",
      tags: "coat check textured camel brown long sleeves buttoned cuffs",
      status: "Pending",
    },
    {
      id: 2,
      title: "Chicken Puff (set of 20)",
      category: "Pastry",
      price: "85",
      tags: "coat camel black grey marl lapel collar hip flap pockets",
      status: "Paid",
    },
    {
      id: 3,
      title: "Beef Casserole",
      category: "Savoury",
      price: "70",
      tags: "coat camel white short sleeves double-breasted button",
      status: "Cancelled By Seller",
    },
    {
      id: 1,
      title: "Strawberry Shortcake",
      category: "Cake",
      price: "60",
      tags: "coat check textured camel brown long sleeves buttoned cuffs",
      status: "Pending",
    },
    {
      id: 2,
      title: "Chicken Puff (set of 20)",
      category: "Pastry",
      price: "85",
      tags: "coat camel black grey marl lapel collar hip flap pockets",
      status: "Paid",
    },
    {
      id: 3,
      title: "Beef Casserole",
      category: "Savoury",
      price: "70",
      tags: "coat camel white short sleeves double-breasted button",
      status: "Cancelled By Seller",
    },
  ]);
  */

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

  // handleSubmitUpdateUsername [discard]
  const [username, setUsername] = useState("");

  const handleSubmitUpdateUsername = async (event) => {
    event.preventDefault();
  };

  // handleCancelOrder
  const [cancelOrderError, setCancelOrderError] = useState(null);
  const [cancelOrderSuccess, setCancelOrderSuccess] = useState(null);
  const handleCancelOrder = async (oId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/buyers/${oId}/cancelorder`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          // redirect to homepage
          console.log("cancelled order: ", oId);
          setCancelOrderSuccess("Successfully Cancelled Order");
        } else {
          // show error message

          console.log("cannot cancel order: ", oId);
          setCancelOrderError("Invalid order details. Please try again.");
          throw new Error(response.statusText);
        }
      })
      .catch((error) => {
        console.log("HTTP Error: ", error);
      });
  };

  // handleReportSeller
  const [reportSellerError, setReportSellerError] = useState(null);
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
 const handleReportSeller = (oId) => {
  fetch(`http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/sellers/2/reports`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      reason,
    }),
  })
    .then(response => {
      if (response.ok) {
        // redirect to homepage
        toast.success("Report submitted successfully!");
        setTimeout(() => {
          navigate(`/`);
        }, 3000);
      } else {
        // show error message
        toast.error("There was an error!");
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      setReportSellerError("Invalid details. Please try again.");
    });
};


  const routeChangeToEditAccountDetails = (buyerId) => {
    console.log("routeChangeToEditAccountDetails: ", buyerId);
    let path = "/buyerEditAccount/";
    navigate(path + buyerId);
  };

  return (

    <div className="background">
        <ToastContainer/>
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
          <div id="buyerOrderCard" onClick={() => routeChangeToOrder(order.id)}>
            <div className="buyerProductImg">
              <img
                className="productImg"
                src={require("../assets/scones.jpg")}
                alt="listing product"
              />
            </div>
            <div id="orderDetailsGrid">
              <div className="orderDetails_top">
                <h2>Order No. {order.orderId}</h2>

                <h4 className="italic">
                  Customisation Notes: {order.description}
                </h4>
                <h4 className="details">{order.dateOfCreation}</h4>
                <Flex>
                  {order.orderStatus === "PENDING" && (
                    <div
                      className="button1_cancel"
                      onClick={() => handleCancelOrder(order.orderId)}
                    >
                      Cancel Order
                      <FaEdit />
                    </div>
                  )}
                </Flex>
                <Popup
                  trigger={
                    <Flex>
                      {order.orderStatus !== "CANCELLED" && (
                        <div
                          className="button1_cancel"
                          onClick={() => handleReportSeller(order.orderId)}
                        >
                          Report Seller
                          <FaEdit />
                        </div>
                      )}
                    </Flex>
                  }
                  modal
                  nested
                >
                  {(close) => (
                    <div className="modal">
                      <button className="close" onClick={close}>
                        &times;
                      </button>
                      <div className="header"> Report Seller </div>
                      <div className="content">
                        <form onSubmit={handleReportSeller}>
                          <FormControl mt={4}>
                            <FormLabel>Title of Report: </FormLabel>
                            <Input
                              type="text"
                              placeholder=" "
                              value={title}
                              onChange={(event) => setTitle(event.target.value)}
                              required
                            />
                          </FormControl>
                          <FormControl mt={4}>
                            <FormLabel>Reason: </FormLabel>
                            <Input
                              type="text"
                              placeholder=" "
                              value={reason}
                              onChange={(event) =>
                                setReason(event.target.value)
                              }
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
                              Submit Report
                            </Button>
                          </Box>
                        </form>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
              <div className="orderDetails_bottom">
                <h2>{order.orderStatus}</h2>
                <h2>
                  {order.quantity} x ${order.price}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerProfile;
