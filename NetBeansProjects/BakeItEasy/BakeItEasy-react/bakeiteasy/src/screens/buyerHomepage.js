import React from "react";
import "./resources/homepage.css";
import Listing from "../components/Listing";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import fetchListings from "../api/listings";

function BuyerHomepage() {
  //const [listings, setListings] = useState([]);
  //listings = useEffect(() => {setListings(fetchListings())});


  return (
    <>
      {" "}
      <Box>
        <h1>Welcome to the Buyer Homepage</h1>
        <Link to="/buyerLogin" color="teal.500" display="block">Login</Link>
      </Box>
      <Box>
        <Listing />
        <Listing />
      </Box>
    </>
  );
}

export default BuyerHomepage;
