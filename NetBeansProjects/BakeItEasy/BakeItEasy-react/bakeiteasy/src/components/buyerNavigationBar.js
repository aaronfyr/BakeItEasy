import "./resources/navigationBar.css";
import {
  Avatar,
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

import { IconContext } from "react-icons";
import { FaUser, FaUserCircle, FaBell } from "react-icons/fa";
import { FiHeart, FiUser, FiBell, FiMessageSquare } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";

export const NavigationBar = () => {
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
        <div className="logo">BakeItEasy</div>
      </Flex>

      <Flex align="center">
        <navChoices>Shop</navChoices>
        <navChoices>My Orders</navChoices>
      </Flex>

      <HStack spacing="15px">
        <IconContext.Provider value={{ color: "#7D7373", size: "2rem" }}>
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
          <FiMessageSquare size="2rem" />
          <FiHeart size="2rem" />

          <Menu>
            <MenuButton>
              <Flex align="center">
                <Tooltip label="username" openDelay={200}>
                  <FiUser />
                </Tooltip>
                <h4>username here</h4>
              </Flex>
            </MenuButton>

            <MenuList>
              <MenuItem gap="0.7rem">
                <FaUserCircle />
                Your profile
              </MenuItem>
              <MenuItem gap="0.7rem">
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
