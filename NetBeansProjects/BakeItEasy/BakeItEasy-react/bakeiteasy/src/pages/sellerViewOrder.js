import React from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  HStack,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { FaRegCommentAlt, FaHeart } from "react-icons/fa";

import "./resources/default.css";
import "./resources/sellerViewOrder.css";

import { NavigationBar } from "../components/buyerNavigationBar";

function SellerViewOrder() {
  const { id } = useParams();



  return (
    <div>
      <NavigationBar />
      <br/>
      <h1>Order ID #order.id</h1>
      <div id="listingContainer">
        <div id="leftListingContainer">
          <div class="slideshow-container"></div>
          <Flex justifyContent={"space-between"}>
          </Flex>
          <br />

          <br />
          <div id="listingDetailsGrid">
            {/*    this.price = price;
        this.quantity = quantity;
        this.description = description;
        this.orderStatus = OrderStatus.PENDING;
        this.address = address;
        this.dateOfCreation = dateOfCreation;
        this.dateOfCollection = dateOfCollection; */}

          </div>
          <br />
        </div>
        <div id="rightListingContainer">
            <h3>Price:</h3>
            <h2>order.price</h2>
            <h3>Quantity:</h3>
            <h2>order.quantity</h2>
            <h3>Description:</h3>
            <h2>order.description</h2>
            <h3>Order status:</h3>
            <h2>order.status</h2>
            <h3>Address:</h3>
            <h2>order.address</h2>
            <h3>Collection Date:</h3>
            <h2>order.dateOfCollection</h2>
            <h3>Buyer:</h3>
            <h2>order.buyer.username</h2>
            <br></br>
            <Flex>
                <div className="button1">Approve</div>
                <div className="button1">
                <FaRegCommentAlt />
                Chat
                </div>
            </Flex>
        </div>
      </div>
    </div>
  );
}

export default SellerViewOrder;
