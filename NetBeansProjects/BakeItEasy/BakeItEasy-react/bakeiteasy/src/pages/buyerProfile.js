import { React, useEffect, useState } from "react";
import "./resources/profile.css";
import { toast, ToastContainer } from "react-toastify";
import { NavigationBar } from "../components/buyerNavigationBar";
import { OrderListingHeader } from "../components/orderListingHeader";

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
  Spacer,
} from "@chakra-ui/react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { FaEdit } from "react-icons/fa";
import { MdOutlineReport, MdOutlineCancel } from "react-icons/md";

function BuyerProfile() {
  const { id } = useParams();

  //fetch buyer
  const [buyer, setBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState("Log In");
  const [buyerUsername, setBuyerUsername] = useState("Log In");
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
          setBuyerUsername(parsedUser.username);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // fetch orders
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

  let navigate = useNavigate();
  const routeChangeToOrder = (id) => {
    let path = "/buyerOrder/";
    navigate(path + id);
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
    );

    if (response.ok) {
      // redirect to homepage
      console.log("cancelled order: ", oId);
      toast.success(`Cancelled Order #${oId}.`);
      setCancelOrderSuccess("Successfully Cancelled Order");
    } else {
      // show error message

      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  // handleReportSeller
  const [reportSellerError, setReportSellerError] = useState(null);
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");

  const handleReportSeller = async (event, oId) => {
    event.preventDefault();
    const sellerResponse = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${oId}/seller`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const sellerData = await sellerResponse.json();
    const sellerId = sellerData.sellerId;

    if (sellerResponse.ok) {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/sellers/${sellerId}/reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            reason,
          }),
        }
      );
      if (response.ok) {
        // redirect to homepage
        console.log("reported seller!");
        toast.success(`Reported Seller ${sellerId}.`);
      } else {
        const errorData = await response.json();
        console.log("reporting error:", errorData.error);
        toast.error(errorData.error);
      }
    } else {
      // show error message
      setReportSellerError("Invalid details. Please try again.");
    }
  };

  const routeChangeToEditAccountDetails = (buyerId) => {
    console.log("routeChangeToEditAccountDetails: ", buyerId);
    let path = "/buyerEditAccount/";
    navigate(path + buyerId);
  };

  return (
    <div className="background">
      <ToastContainer />
      <NavigationBar />
      <div id="coverPhoto">
        <div id="profilePhoto"></div>
      </div>
      <Flex justifyContent={"space-between"}>
        <div id="userDetails">
          <h1>{buyerName}</h1>

          <h4>@{buyerUsername}</h4>
        </div>
        <Flex>
          <div
            className="button1_editAccount"
            onClick={() => routeChangeToEditAccountDetails()}
          >
            Edit Account Details
            <FaEdit />
          </div>
        </Flex>
      </Flex>
      <br />
      <div class="shoppingHeader">My Orders</div>
      <br />
      <div class="ordersDisplay">
        {orders.map((order) => (
          <div id="buyerOrderCard">
            <div className="buyerProductImg">
              <img
                className="productImg"
                src={require("../assets/scones.jpg")}
                alt="listing product"
              />
            </div>
            <div id="buyerOrderDetailsGrid">
              <div className="orderDetails_left">
                <OrderListingHeader oId={order.orderId} />
                <h4 className="italic">Order No. {order.orderId}</h4>

                <h4 className="details">
                  Customisation Notes: {order.description}
                </h4>
                <h4 className="details">
                  Collection Date: {order.dateOfCollection}
                </h4>
              </div>
              <div>
                <h4 className="italic">Status:</h4>
                <h2>{order.orderStatus}</h2>
                <h4 className="italic">Price:</h4>
                <h2>
                  {order.quantity} x ${order.price}
                </h2>
              </div>
              <div className="orderDetails_right">
                <Flex>
                  {order.orderStatus === "PENDING" && (
                    <div
                      className="button1_cancel"
                      onClick={() => handleCancelOrder(order.orderId)}
                    >
                      Cancel Order
                      <MdOutlineCancel />
                    </div>
                  )}
                </Flex>

                <Popup
                  trigger={
                    <Flex>
                      {order.orderStatus !== "CANCELLED" && (
                        <div className="button1_report">
                          Report Seller
                          <MdOutlineReport size="1.2rem" />
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
                        <form
                          onSubmit={(event) =>
                            handleReportSeller(event, order.orderId)
                          }
                        >
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerProfile;
