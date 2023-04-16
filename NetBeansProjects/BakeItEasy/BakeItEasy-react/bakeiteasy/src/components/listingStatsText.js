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

export function ListingStatsText({ lId }) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [cancelled, setCancelled] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [listingSellers, setListingSellers] = useState({});
  const [listingSellerImages, setListingSellerImages] = useState({});
  const [listingSellerIds, setListingSellerIds] = useState({});

  const getNumbersForListing = async (lId) => {

    //pending
     try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/pendingOrdersQuantity`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("pending ", data);
      setPending(parseInt(data));
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }

    //accepted
     try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/acceptedOrdersQuantity`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("accepted ", data);
      setAccepted(parseInt(data));
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }

    //rejected
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/rejectedOrdersQuantity`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("rejected ", data);
      setRejected(parseInt(data));
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }

    //cancelled
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/cancelledOrdersQuantity`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("completed ", data);
      setCancelled(parseInt(data));
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }

    //completed
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/completedOrdersQuantity`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("completed ", data);
      setCompleted(parseInt(data));
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }
  };

  // return render statements
  if (lId) {
    return (
      <div
      >
        <Flex>
            <h3 style={{color:"darkgray"}}>Pending:</h3> <h5 style={{marginTop:5, fontSize:15, marginLeft:7}}>{pending}</h5>
        </Flex>
        <Flex>
            <h3 style={{color:"mediumseagreen"}}>Accepted:</h3> <h5 style={{marginTop:5, fontSize:15, marginLeft:7}}>{accepted}</h5>
        </Flex>
        <Flex>
            <h3 style={{color: "darkgreen"}}>Completed:</h3> <h5 style={{marginTop:5, fontSize:15, marginLeft:7}}>{completed}</h5>
        </Flex>
        <Flex>
            <h3>Rejected:</h3> <h5 style={{marginTop:5, fontSize:15, marginLeft:7}}>{rejected}</h5>
        </Flex>
        <Flex>
            <h3 style={{color: "#4D5C74"}}>Cancelled:</h3> <h5 style={{marginTop:5, fontSize:15, marginLeft:7}}>{cancelled}</h5>
        </Flex>

      </div>
    );
  } else {
    getNumbersForListing(lId);
    return <ReactLoading color={"black"} height={"15%"} width={"15%"} />;

  }
}

export const ListingStatsMemo = memo(ListingStatsText);
