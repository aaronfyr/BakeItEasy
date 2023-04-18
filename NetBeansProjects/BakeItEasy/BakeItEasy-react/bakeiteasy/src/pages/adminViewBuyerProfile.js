import { React, useEffect, useState } from "react";
import { AdminOrderSellerHeader } from "../components/adminOrderSellerHeader";
import { OrderListingHeader } from "../components/orderListingHeader";
import { OrderListingImage } from "../components/orderListingImage";
import { OrderSellerHeader } from "../components/orderSellerHeader";
import "./resources/profile.css";

import { useNavigate, useLocation } from "react-router-dom";

import { Flex } from "@chakra-ui/react";
import "reactjs-popup/dist/index.css";
import AdminMenuBar from "../components/adminMenuBar";

function AdminViewBuyerProfile() {
  const buyerId = new URLSearchParams(useLocation().search).get("id");

  let navigate = useNavigate();

  //fetch buyer
  const [buyerName, setBuyerName] = useState("Log In");
  const [buyerUsername, setBuyerUsername] = useState("Log In");
  const [buyerProfilePhoto, setBuyerProfilePhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedUser = await response.json();
      console.log("parsedUser: ", parsedUser);
      console.log("parsedUser.name: ", parsedUser.name);
      setBuyerName(parsedUser.name);
      setBuyerUsername(parsedUser.username);
      setBuyerProfilePhoto(parsedUser.imagePath);
    };
    fetchData();
  }, [buyerId]);

  // fetch orders
  const [orders, setOrders] = useState([]);

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

  return (
    <div className="background">
      <AdminMenuBar />
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
      </Flex>
      <br />
      <div class="shoppingHeader">
        <h1>Orders</h1>
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
                <AdminOrderSellerHeader oId={order.orderId} />
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminViewBuyerProfile;
