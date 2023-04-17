import React, { memo, useState } from "react";
import ReactLoading from "react-loading";

export function OrderListingImageNonMemo({ oId }) {
  const [orderListings, setOrderListings] = useState({});
  const [orderListingImages, setOrderListingImages] = useState({});

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
      setOrderListingImages({
        ...orderListingImages,
        [oId]: data.imagePaths[0],
      });
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
        <img
          className="productImg"
          src={
            orderListingImages[oId]
              ? orderListingImages[oId]
              : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
          }
          alt="baked listing"
        />
      </>
    );
  } else {
    getListingByOId(oId);
    return <ReactLoading color={"#D3D3D3"} height={"15%"} width={"15%"} />;
    //return <p>Loading...</p>;
  }
}

export const OrderListingImage = memo(OrderListingImageNonMemo);
