import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import "./resources/navigationBar.css";


import { ChevronDownIcon } from "@chakra-ui/icons";
import { IconContext } from "react-icons";
import { FaUserCircle } from "react-icons/fa";
import { FiHeart, FiUser } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";

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
        navigate("/login?type=buyer");
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

  // Routing to forum
  const routeToForum = () => {
    console.log("Navigate to: ", "forum");
    navigate("/forum");
  };

  // Routing to sellers
  const routeToSearchSellers = () => {
    console.log("Navigate to: ", "search sellers");
    navigate("/searchSellers");
  };

  // Handle log out
  const handleLogOut = () => {
    console.log("Navigate to: ", "login");
    localStorage.clear();
    navigate("/login?type=buyer");
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
        <div
          id="navChoices"
          onClick={() => {
            routeToHomePage();
          }}
        >
          Home
        </div>
        <div
          id="navChoices"
          onClick={() => {
            routeToForum();
          }}
        >
          Forum
        </div>
        <div id="navChoices" onClick={() => routeToSearchSellers()}>
          Find Seller
        </div>
        <div id="navChoices" onClick={() => routeToProfile()}>
          My Orders
        </div>
      </Flex>

      <HStack spacing="7px">
        <IconContext.Provider value={{ size: "1.2rem" }}>
          <div className="icon-circle">
            <FiHeart style={{cursor: "pointer"}}onClick={() => routeToLikedListings()} />
          </div>
          <Menu>
            <MenuButton
              variant="ghost"
              colorScheme="orange"
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <HStack spacing="10px">
                <FiUser />

                <p style={{ fontFamily: "Montserrat" }}>{buyerName}</p>
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
