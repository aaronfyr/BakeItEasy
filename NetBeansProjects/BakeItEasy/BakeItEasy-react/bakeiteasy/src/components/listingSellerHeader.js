import React, { useState, memo } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import {
  Avatar,
  Button,
  Flex,
  Heading,
  HStack,
  Tooltip,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Spacer,
} from "@chakra-ui/react";
import ReactLoading from "react-loading";

export function ListingSellerHeaderNonMemo({ lId }) {
  const navigate = useNavigate();
  const [listingSellers, setListingSellers] = useState({});
  const [listingSellerImages, setListingSellerImages] = useState({});
  const [listingSellerIds, setListingSellerIds] = useState({});

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
      //console.log("sellerUsername: ", data.username);
      setListingSellers({ ...listingSellers, [lId]: data.username });
      setListingSellerImages({ ...listingSellerImages, [lId]: data.imagePath });
      setListingSellerIds({ ...listingSellerIds, [lId]: data.sellerId });
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
  if (listingSellers[lId]) {
    return (
      <div
        className="listingSellerHeader"
        onClick={() => routeChangeToSellerProfile(listingSellerIds[lId])}
      >
        <HStack>
          <div className="homepageProfilePhoto">
            {listingSellerImages[lId] && (
              <img
                className="homepageProfilePhotoImg"
                alt="seller pfp"
                src={listingSellerImages[lId]}
              ></img>
            )}
            {!listingSellerImages[lId] && (
              <img
                width="30px"
                height="30px"
                src={require("../assets/dummyuser.png")}
                alt="listing product"
              />
            )}
          </div>
          <p>{listingSellers[lId]}</p>
        </HStack>
      </div>
    );
  } else {
    getSellerByLId(lId);
    return <ReactLoading color={"#D3D3D3"} height={"15%"} width={"15%"} />;
  }
}

export const ListingSellerHeader = memo(ListingSellerHeaderNonMemo);
