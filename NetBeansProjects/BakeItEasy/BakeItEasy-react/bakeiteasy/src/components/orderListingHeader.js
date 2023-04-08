import React, { useState, memo } from "react";
import ReactLoading from "react-loading";

export function OrderListingHeaderNonMemo({ oId }) {
  const [orderListings, setOrderListings] = useState({});
  const [orderListingIds, setOrderListingIds] = useState({});

  const getListingByOId = async (oId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/listing`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("listing title: ", data);
      setOrderListings({ ...orderListings, [oId]: data.name });
      setOrderListingIds({ ...orderListingIds, [oId]: data.listingId });
      return data.name;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }
  };

  if (orderListings[oId]) {
    return (
      <>
        <p>{orderListings[oId]}</p>
        <p>{orderListingIds[oId]}</p>
      </>
    );
  } else {
    getListingByOId(oId);
    return <ReactLoading color={"#D3D3D3"} height={"15%"} width={"15%"} />;
    //return <p>Loading...</p>;
  }
}

export const OrderListingHeader = memo(OrderListingHeaderNonMemo);
