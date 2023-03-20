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
} from "@chakra-ui/react";

import { IconContext } from "react-icons";
import { FaUser, FaUserCircle, FaBell } from "react-icons/fa";
import { FiHeart, FiUser, FiBell, FiMessageSquare } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { ChevronDownIcon } from "@chakra-ui/icons";

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
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Flex align="center">
                <FiUser />

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
