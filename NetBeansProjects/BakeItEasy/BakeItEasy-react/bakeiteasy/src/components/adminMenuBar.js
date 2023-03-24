import { Box, Flex, Spacer, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function AdminMenuBar() {
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
        <Link to="/viewAllBuyers" style={{marginRight:"20px"}}>
          <navChoices>View All Buyers</navChoices>
        </Link>
        <Link to="/viewAllSellers">
          <navChoices>View All Sellers</navChoices>
        </Link>
      </Flex>
      <div style={{width: "100px"}}></div>

    </div>
  );
}

export default AdminMenuBar;
