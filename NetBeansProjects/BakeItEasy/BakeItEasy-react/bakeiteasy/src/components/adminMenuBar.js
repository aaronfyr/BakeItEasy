import { Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function AdminMenuBar() {
  return (
    <div className="navbar">
      <Flex align="center">
        <Link
          to="/adminHomepage"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            width="50px"
            height="50px"
            hspace="30px"
            src={require("../assets/bakeiteasy-logo.png")}
            alt="BakeItEasy"
            style={{marginRight:"10px"}}
          ></img>
          <div className="logo">BakeItEasy</div>
        </Link>
      </Flex>
      <Flex align="center">
        <Link to="/viewAllReports" style={{ marginRight: "50px" }}>
          <navChoices>Reports</navChoices>
        </Link>
        <Link to="/viewAllBuyers" style={{ marginRight: "50px" }}>
          <navChoices>View All Buyers</navChoices>
        </Link>
        <Link to="/viewAllSellers" style={{ marginRight: "50px" }}>
          <navChoices>View All Sellers</navChoices>
        </Link>
      </Flex>
      <div style={{ width: "100px" }}></div>
    </div>
  );
}

export default AdminMenuBar;
