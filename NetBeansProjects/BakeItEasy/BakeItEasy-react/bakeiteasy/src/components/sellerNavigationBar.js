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

export const SellerNavigationBar = () => {
  const navigate = useNavigate();

  // Fetch this seller details
  const [seller, setSeller] = useState(null);
  const [sellerName, setSellerName] = useState("Log In");
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      if (!fetchedSeller) {
        console.log("navbar", "no seller");
        navigate("/login");
      } else {
        console.log("navbar", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSeller(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.name: ", parsedUser.name);
          setSellerName(parsedUser.name);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // Routing to Buyer Profile
  const routeToProfile = () => {
    let path = "/sellerProfile";
    console.log("Navigate to profile of: ", seller.id);
    navigate(path);
  };

  // Routing to Buyer Home Page
  const routeToHomePage = () => {
    console.log("Navigate to: ", "homepage");
    navigate("/sellerProfile");
  };

  // Routing to Appointments
  const routeToAppointments = () => {
    console.log("Navigate to: ", "appointments");
    navigate("/sellerAppointments");
  };

  // Routing to Order Mgmt
  const routeToOrderMgmt = () => {
    console.log("Navigate to: ", "orderManagement");
    navigate("/sellerOrderMgmt");
  };

  // Routing to seller profile
  const routeToSellerProfile = () => {
    console.log("Navigate to: ", "sellerProfile");
    navigate("/sellerProfile");
  };

  // Routing to forum
  const routeToForum = () => {
    console.log("Navigate to: ", "forum");
    navigate("/forum");
  };

  // Handle log out
  const handleLogOut = () => {
    console.log("Navigate to: ", "login");
    localStorage.clear();
    navigate("/login?type=seller");
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
        <div className="logoSubscript" onClick={() => routeToHomePage()}>
          for B A K E R S
        </div>
      </Flex>

      <Flex align="center">
        <div id="navChoices" onClick={() => routeToSellerProfile()}>
          Shop Profile{" "}
        </div>
        <div id="navChoices" onClick={() => routeToOrderMgmt()}>
          My Orders
        </div>
        <div id="navChoices" onClick={() => routeToAppointments()}>
          Appointments
        </div>
        <div id="navChoices" onClick={() => routeToForum()}>
          Forum
        </div>
      </Flex>

      <HStack spacing="15px">
        <IconContext.Provider value={{ color: "#7D7373", size: "1.5rem" }}>
          <Popover>
            <PopoverTrigger>
              <FiBell />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Notifications!</PopoverHeader>
              <PopoverBody>You have no new notifications.</PopoverBody>
            </PopoverContent>
          </Popover>
          <FiMessageSquare />
          <FiHeart />

          <Menu>
            <MenuButton
              variant="ghost"
              colorScheme="orange"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <HStack spacing="10px">
                <FiUser />
                <p>{sellerName}</p>
              </HStack>
            </MenuButton>

            <MenuList>
              <MenuItem
                gap="0.7rem"
                onClick={() => {
                  routeToProfile();
                }}
              >
                <FaUserCircle />
                Edit Account
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
