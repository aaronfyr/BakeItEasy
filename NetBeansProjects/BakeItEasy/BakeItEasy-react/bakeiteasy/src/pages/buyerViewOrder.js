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
import "./resources/listing.css";

import { NavigationBar } from "../components/buyerNavigationBar";

function BuyerViewOrder() {
  const { id } = useParams();
  return (
    <div>
      <NavigationBar />
      <div id="listingContainer">
        <div id="leftListingContainer">
          <div class="slideshow-container"></div>
          <Flex justifyContent={"space-between"}>
            <Flex>
              <div className="button1">Share</div>
              <div className="button1">
                <FaHeart />
                Likes
              </div>
            </Flex>
            <div className="button1">
              <FaRegCommentAlt />
              Chat
            </div>
          </Flex>
          <br />
          <h1>Listing name</h1>
          <br />
          <div id="listingDetailsGrid">
            <h4>Posted on:</h4>
            <h4 className="details">date</h4>

            <h4>Quantity Available:</h4>
            <h4 className="details">quantity</h4>

            <h4>Minimum Preparation Time:</h4>
            <h4 className="details">time</h4>
          </div>
          <br />
          <h3 className="italic">Description:</h3>
          <h4 className="details">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </h4>
        </div>
        <div id="rightListingContainer">
          <form>
            <h3>Field1:</h3>
            <input type="text" id="oneLineInput" name="lname" />
            <h3>Field2:</h3>
            <input type="text" id="oneLineInput" name="lname" />
            <h3>Quantity:</h3>
            <input type="text" id="oneLineInput" name="lname" />
            <h3>Customisation:</h3>
            <input type="text" id="customisationInput" name="lname" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default BuyerViewOrder;
