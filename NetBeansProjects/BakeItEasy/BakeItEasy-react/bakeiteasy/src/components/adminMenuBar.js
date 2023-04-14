import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiHeart, FiUser, FiBell, FiMessageSquare } from "react-icons/fi";

import { IoLogOut } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "./resources/navigationBar.css";
import "./resources/adminProfilePhotoDisplay.css";


function AdminMenuBar() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const admin = localStorage.getItem("admin");
      if (!admin) {
        navigate("/adminLogin");
      } else {
        const parsedUser = JSON.parse(admin);
        setAdmin(parsedUser);
      }
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    // Clear session/token data
    localStorage.clear();

    // Redirect to login page
    navigate("/adminLogin");
  };

  return (
    <div className="navbar">
      <Flex align="center">
        <Link
          to="/adminProfilePage"
          style={{ display: "flex", alignItems: "center", marginLeft: "75px" }}
        >
          <img
            width="50px"
            height="50px"
            hspace="30px"
            src={require("../assets/bakeiteasy-logo.png")}
            alt="BakeItEasy"
          ></img>
          <div className="logo">BakeItEasy</div>
        </Link>
      </Flex>
      <Flex align="center">
        <Link to="/viewAllReports" style={{ marginRight: "100px" }}>
          <Text>Reports</Text>
        </Link>
        <Link to="/viewAllBuyers" style={{ marginRight: "100px" }}>
          <Text>Buyers</Text>
        </Link>
        <Link to="/viewAllSellers" style={{ marginRight: "100px" }}>
          <Text>Sellers</Text>
        </Link>

        {admin && (
          <>
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<ChevronDownIcon />}
                type="submit"
                fontWeight="bold"
                ml="375px"
              >
                <Flex align="center">
                  <FiUser style={{ marginRight: "10px" }} />
                  {admin.email}
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Link
                    to="/adminProfilePage"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <FaUserCircle style={{ marginRight: "10px" }} /> Edit
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <IoLogOut style={{ marginRight: "10px" }} />
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        )}
        <div style={{ width: "75px" }}></div>
      </Flex>
    </div>
  );
}

export default AdminMenuBar;
