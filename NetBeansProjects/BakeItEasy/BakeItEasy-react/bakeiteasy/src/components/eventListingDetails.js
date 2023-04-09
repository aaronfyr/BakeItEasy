import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";

export function EventListingDetails({ oId }) {
  // fetch buyer

  console.log("oid: ", oId);
  const [buyer, setBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/buyer`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setBuyer(data);
        setBuyerName(data.username);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, []);

  // fetch listing
  const [listing, setListing] = useState(null);
  const [listingName, setListingName] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/listing`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setListing(data);
        setListingName(data.name);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <p>Buyer: {buyerName}</p>
      <p>Listing Name: {listingName}</p>
    </>
  );
}