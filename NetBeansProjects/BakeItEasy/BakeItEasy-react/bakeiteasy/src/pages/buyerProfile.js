import { React, useEffect, useState } from "react";
import "./resources/profile.css";

import { NavigationBar } from "../components/buyerNavigationBar";

import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Flex, Button } from "@chakra-ui/react";

function BuyerProfile() {
  const [buyer, setBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState("Log In");

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
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

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

  return (
    <div className="background">
      <NavigationBar />
      <div id="coverPhoto">
        <div id="profilePhoto"></div>
      </div>
      <div id="userDetails">
        <h1>{buyerName}</h1>
        <h4>details</h4>
      </div>
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

export default BuyerProfile;
