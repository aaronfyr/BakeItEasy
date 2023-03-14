import React from "react";
import "./resources/homepage.css";
import Listing from "../components/Listing";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";

function BuyerHomepage() {
  return (
    <>
      {" "}
      <Box>
        <h1>Welcome to the Buyer Homepage</h1>
        <Link to="/buyerLogin">Login</Link>
      </Box>
      <Box>
        <Listing />
        <Listing />
      </Box>
    </>
  );
}

export default BuyerHomepage;
