import { HStack } from "@chakra-ui/react";
import React, { memo, useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";

export function OrderSellerHeaderNonMemo({ oId }) {
  const navigate = useNavigate();
  const [orderSellers, setOrderSellers] = useState({});
  const [orderSellerImages, setOrderSellerImages] = useState({});
  const [orderSellerIds, setOrderSellerIds] = useState({});

  const getSellerByOId = async (oId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/orders/${oId}/seller`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      //console.log("sellerUsername: ", data.username);
      setOrderSellers({ ...orderSellers, [oId]: data.username });
      setOrderSellerImages({ ...orderSellerImages, [oId]: data.imagePath });
      setOrderSellerIds({ ...orderSellerIds, [oId]: data.sellerId });
      return data.username;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }
  };

  // routeChangeToSellerProfile
  const routeChangeToSellerProfile = (sId) => {
    if (sId) {
      let path = "/buyerViewSellerProfile/" + sId;
      navigate(path);
    }
  };

  // return render statements
  if (orderSellers[oId]) {
    return (
      <div
        className="listingSellerHeader"
        onClick={() => routeChangeToSellerProfile(orderSellerIds[oId])}
      >
        <HStack>
          <div className="homepageProfilePhoto">
            {orderSellerImages[oId] && (
              <img
                className="homepageProfilePhotoImg"
                alt="seller pfp"
                src={orderSellerImages[oId]}
              ></img>
            )}
            {!orderSellerImages[oId] && (
              <img
                width="30px"
                height="30px"
                src={require("../assets/dummyuser.png")}
                alt="order product"
              />
            )}
          </div>
          <p>{orderSellers[oId]}</p>
        </HStack>
      </div>
    );
  } else {
    getSellerByOId(oId);
  }
}

export const OrderSellerHeader = memo(OrderSellerHeaderNonMemo);
