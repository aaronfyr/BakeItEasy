import { React, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavigationBar } from "../components/buyerNavigationBar";
import { OrderListingHeader } from "../components/orderListingHeader";
import { OrderSellerHeader } from "../components/orderSellerHeader";
import { OrderListingImage } from "../components/orderListingImage";
import { OrderRateButton } from "../components/orderRateButton";
import { OrderReportButton } from "../components/orderReportButton";
import "./resources/profile.css";

import { useNavigate, useParams } from "react-router-dom";

import {
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaPhone } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import "reactjs-popup/dist/index.css";

function BuyerProfile() {
  const { id } = useParams();
  let navigate = useNavigate();

  //fetch buyer
  const [buyerName, setBuyerName] = useState("Log In");
  const [buyerUsername, setBuyerUsername] = useState("Log In");
  const [buyerId, setBuyerId] = useState(null);
  const [buyerProfilePhoto, setBuyerProfilePhoto] = useState(null);

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
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.name: ", parsedUser.name);
          setBuyerName(parsedUser.name);
          setBuyerId(parsedUser.buyerId);
          setBuyerUsername(parsedUser.username);
          setBuyerProfilePhoto(parsedUser.imagePath);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, [navigate]);

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
  }, [navigate]);

  const [whatsappUrl, setWhatsappUrl] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/orders/${id}/sellerPhoneNo`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setWhatsappUrl("https://wa.me/65" + data);
        console.log(whatsappUrl);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        } else {
          console.log("Other error: ", error);
        }
      }
    };
    fetchData();
  }, [whatsappUrl, id]);

  // handleCancelOrder
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
      onOpen();
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
      `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/seller`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const sellerData = await sellerResponse.json();
    const sellerId = sellerData.sellerId;
    const sellerUsername = sellerData.username;

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
        setTitle("-");
        toast.success(`Reported Seller ${sellerUsername}.`);
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

  // handleCreateReview
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [imagePaths, setImagePath] = useState(["", "text"]);
  const handleCreateReview = async (event, oId) => {
    event.preventDefault();
    const dateCreated = new Date();
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/reviews`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          reviewText,
          rating,
          imagePaths,
          dateCreated,
        }),
      }
    );
    if (response.ok) {
      // redirect to homepage
      console.log("created rating: ", oId);
      toast.success(`Submitted review for Order #${oId}!`);
    } else {
      const errorData = await response.json();
      console.log("reporting error:", errorData.error);
      toast.error(errorData.error);
    }
  };

  const routeChangeToEditAccountDetails = (buyerId) => {
    console.log("routeChangeToEditAccountDetails: ", buyerId);
    let path = "/buyerEditAccount";
    navigate(path);
  };

  // successful cancelOrder
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(5px) hue-rotate(-10deg)"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const handleRating = (rate) => {
    setRating(rate);
    console.log("handleRating:", rating);
  };

  return (
    <div className="background">
      <ToastContainer />
      <NavigationBar />

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Cancelled order!</ModalHeader>
          <Flex>
            <Spacer />
            <ModalBody>
              <img
                width="250px"
                height="250px"
                src={require("../assets/cancel_order.gif")}
                alt="listing product"
              />
            </ModalBody>
            <Spacer />
          </Flex>
          <Flex>
            <Spacer />
            <ModalFooter>
              <Button
                onClick={() => window.location.reload()}
                colorScheme="orange"
                variant="ghost"
              >
                Return
              </Button>
            </ModalFooter>
            <Spacer />
          </Flex>
        </ModalContent>
      </Modal>
      <div id="coverPhoto">
        <div id="profilePhoto">
          <img
            className="homepageProfilePhotoImg"
            alt=""
            src={buyerProfilePhoto}
          ></img>
        </div>
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
            {" "}
            <HStack spacing="10px">
              <div>Edit Account Details</div>
              <FaEdit />
            </HStack>
          </div>
        </Flex>
      </Flex>
      <br />
      <div class="shoppingHeader">
        <h1>My Orders</h1>
      </div>
      <br />

      <div class="ordersDisplay">
        {orders.map((order) => (
          <div id="buyerOrderCard">
            <div className="buyerProductImg">
              <OrderListingImage oId={order.orderId} />
            </div>
            <div id="buyerOrderDetailsGrid">
              <div className="orderDetails_left">
                <OrderSellerHeader oId={order.orderId} />
                <OrderListingHeader oId={order.orderId} />
                <h4 className="italic">Order ID #{order.orderId}</h4>

                <h4 className="details">
                  Customisation Notes: {order.description}
                </h4>
                <h4 className="details">
                  Collection Date:{" "}
                  {order.dateOfCollection.toString().substring(0, 10)}
                </h4>
              </div>
              <div>
                <h4 className="italic">Status:</h4>
                {order.orderStatus === "COMPLETED" && (
                  <h2 className="COMPLETED">{order.orderStatus}</h2>
                )}
                {order.orderStatus === "REJECTED" && (
                  <h2 className="REJECTED">{order.orderStatus}</h2>
                )}
                {order.orderStatus === "PENDING" && (
                  <h2 className="PENDING">{order.orderStatus}</h2>
                )}
                {order.orderStatus === "CANCELLED" && (
                  <h2 className="CANCELLED">{order.orderStatus}</h2>
                )}
                {order.orderStatus === "ACCEPTED" && (
                  <h2 className="ACCEPTED">{order.orderStatus}</h2>
                )}
                {/* <h4 className="italic">Price:</h4> */}
                <h4 className="details">
                  Quantity: {order.quantity} <br />
                  Unit Price: ${order.price} <br />
                  Total: ${order.price * order.quantity}
                </h4>
              </div>
              <div className="orderDetails_right">
                <Flex>
                  {order.orderStatus === "PENDING" && (
                    <div
                      className="button1_cancel"
                      onClick={() => handleCancelOrder(order.orderId)}
                    >
                      <HStack spacing="8px">
                        <div>Cancel Order</div>
                        <MdOutlineCancel />
                      </HStack>
                    </div>
                  )}
                </Flex>

                <OrderReportButton
                  buyerId={buyerId}
                  oId={order.orderId}
                  orderStatus={order.orderStatus}
                />
                <OrderRateButton
                  oId={order.orderId}
                  orderStatus={order.orderStatus}
                />
                <a
                  className="button1_cancel"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ width: "150px" }}
                >
                  <HStack spacing="10px">
                    <div>Whatsapp</div>
                    <FaPhone />
                  </HStack>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuyerProfile;
