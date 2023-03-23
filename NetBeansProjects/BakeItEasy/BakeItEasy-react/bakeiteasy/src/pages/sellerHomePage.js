import React from "react";
import Listing from "../components/Listing";
import { Link } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import fetchListings from "../context/listings";

function SellerHomepage() {
  //const [listings, setListings] = useState([]);
  //listings = useEffect(() => {setListings(fetchListings())});

  return (
    <>
      {" "}
      <Box>
        <h1>Welcome to the Seller Homepage</h1>
        <Link to="/sellerLogin" color="teal.500" display="block">
          Login
        </Link>
      </Box>
      <Box>
        <Listing />
        <Listing />
      </Box>
    </>
  );
}

export default SellerHomepage;
