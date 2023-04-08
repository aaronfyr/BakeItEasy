import React, { useState, memo } from "react";
import ReactLoading from "react-loading";

export function ListingSellerHeaderNonMemo({ lId }) {
  const [listingSellers, setListingSellers] = useState({});

  const getSellerByLId = async (lId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/seller`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      //console.log(`HTTP Response Code: ${response?.status}`);
      //console.log("sellerId: ", data.sellerId);
      console.log("sellerUsername: ", data.username);
      //console.log("sellerName: ", data.name);
      //obj.sellerId = data.sellerId;
      //obj.sellerUsername = data.username;
      //obj.sellerName = data.name;
      setListingSellers({ ...listingSellers, [lId]: data.username });
      return data.username;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
      //obj.sellerId = "User not found";
      //obj.sellerUsername = "User not found";
      //obj.sellerName = "User not found";
    }
  };

  if (listingSellers[lId]) {
    return <p>{listingSellers[lId]}</p>;
  } else {
    getSellerByLId(lId);
    return <ReactLoading color={"#D3D3D3"} height={"15%"} width={"15%"} />;
    //return <p>Loading...</p>;
  }
}

export const ListingSellerHeader = memo(ListingSellerHeaderNonMemo);
