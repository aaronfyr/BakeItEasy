import { React, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";

import "./resources/navigationBar.css";
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
  Spacer,
} from "@chakra-ui/react";

import { IconContext } from "react-icons";
import { FaUser, FaUserCircle, FaBell } from "react-icons/fa";
import { FiHeart, FiUser, FiBell, FiMessageSquare } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { ChevronDownIcon } from "@chakra-ui/icons";

export const NavigationBar = () => {
  const [seller, setSeller] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState("Log In");
  const [buyerId, setBuyerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const fetchedBuyer = localStorage.getItem("buyer");
      if (!fetchedBuyer) {
        console.log("navbar", "no buyer");
        navigate("/login");
      } else {
        console.log("navbar", "has buyer");
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.name: ", parsedUser.name);
          setBuyerName(parsedUser.name);
          console.log("parsedUser.id: ", parsedUser.buyerId);
          setBuyerId(parsedUser.buyerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // Routing to Buyer Profile
  const routeToProfile = () => {
    let path = "/buyerProfile/" + buyerId;
    console.log("Navigate to profile of: ", buyer.id);
    navigate(path);
  };

  // Routing to Buyer Home Page
  const routeToHomePage = () => {
    console.log("Navigate to: ", "homepage");
    navigate("/");
  };

  // Routing to Buyer LikedListings
  const routeToLikedListings = () => {
    console.log("Navigate to: ", "likedlistings");
    navigate("/buyerLikedListings");
  };

  // Handle log out
  const handleLogOut = () => {
    console.log("Navigate to: ", "login");
    localStorage.clear();
    navigate("/login");
    //return <Navigate to="/" />;
  };

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
    <div className="navbar">
      <Flex align="center">
        <img
          width="50px"
          height="50px"
          hspace="30px"
          src={require("../assets/bakeiteasy-logo.png")}
          alt="BakeItEasy"
        ></img>
        <div className="logo" onClick={() => routeToHomePage()}>
          BakeItEasy
        </div>
      </Flex>

      <Flex align="center">
        <div id="navChoices" onClick={() => routeToHomePage()}>
          Shop
        </div>
        <div id="navChoices">My Orders</div>
      </Flex>

      <HStack spacing="7px">
        <IconContext.Provider value={{ size: "1.2rem" }}>
          <Popover>
            <PopoverTrigger>
              <div className="icon-circle">
                <FiBell />
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Notifications!</PopoverHeader>
              <PopoverBody>You have no new notifications.</PopoverBody>
            </PopoverContent>
          </Popover>
          <div className="icon-circle">
            <FiMessageSquare />
          </div>
          <div className="icon-circle">
            <FiHeart onClick={() => routeToLikedListings()} />
          </div>
          <Menu>
            <MenuButton
              variant="ghost"
              colorScheme="orange"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Flex align="center">
                <FiUser />

                <h4>{buyerName}</h4>
              </Flex>
            </MenuButton>

            <MenuList>
              <MenuItem
                gap="0.7rem"
                onClick={() => {
                  routeToProfile();
                }}
              >
                <FaUserCircle />
                Your profile
              </MenuItem>
              <MenuItem
                gap="0.7rem"
                onClick={() => {
                  handleLogOut();
                }}
              >
                <IoLogOut />
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </IconContext.Provider>
      </HStack>
    </div>
  );
};
