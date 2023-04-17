import React, { useEffect, useState } from "react";

export function EventListingDetails({ oId }) {
  // fetch buyer

  console.log("oid: ", oId);
  const [buyer, setBuyer] = useState(null);
  const [buyerUsername, setBuyerUsername] = useState(null);
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
        setBuyerUsername(data.username);
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
  const [listingStatus, setListingStatus] = useState(null);
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
      <br />
      <h3>Buyer:</h3>
      <h1>@{buyerUsername}</h1>
      <h3>For listing:</h3>
      <h1>{listingName}</h1>
    </>
  );
}
