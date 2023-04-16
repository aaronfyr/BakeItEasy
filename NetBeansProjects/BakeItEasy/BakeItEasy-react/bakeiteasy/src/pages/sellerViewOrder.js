import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import {toast, ToastContainer} from "react-toastify";
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
} from "@chakra-ui/react";
import {
  FaRegCommentAlt,
  FaHeart,
  FaCheck,
  FaTimes,
  FaRegStar,
  FaArrowLeft
} from "react-icons/fa";

import "./resources/default.css";
import "./resources/sellerEditProfile.css";
import { formatPrice, formatDate } from '../components/formatter';
import { NavigationBar } from "../components/buyerNavigationBar";
import useOrderBuyer from "../components/getOrderBuyer";

function SellerViewOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [buyer, setBuyer] = useState([]);
  const [listing, setListing] =([]);
  const [url, setUrl]=useState("https://handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg");

  var img = "https://handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg";




 useEffect(() => {
  fetch(`http://localhost:8080/BakeItEasy-war/webresources/orders/${id}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setOrder(data);
      setOrderId(data.orderId);
      // Chain the second fetch call here
      return fetch(`http://localhost:8080/BakeItEasy-war/webresources/orders/${data.orderId}/buyer`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
    .then((response) => response.json())
    .then((data) => {
      setBuyer(data);
      console.log(id, "order id before listing fetch");
    })
    .catch((error) => {
      console.error(error);
    })
    .then(

        fetch(`http://localhost:8080/BakeItEasy-war/webresources/orders/${id}/listing`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
        if (!response.ok) {
            console.log("listing fetch failed");
            toast.error("listing fetch failed");
        }
        return response.json();
    })
    .then((data) => {
        console.log("listing data is", data);
        setUrl(data.imagePaths[0]);
      setListing(data);
    }))
    ;


}, []);



  const [isPending, setPending] = useState(true);
  const [isAccepted, setAccepted] = useState(false);
  const [isRejected, setRejected] = useState(false);
  const [isCompleted, setCompleted] = useState(false);

  useEffect(() => {
    console.log(order.orderStatus);
    if (String(order.orderStatus) === "PENDING") {
      setPending(true);
      setAccepted(false);
      setRejected(false);
      setCompleted(false);
    } else if (order.orderStatus === "ACCEPTED") {
      setPending(false);
      setAccepted(true);
      setRejected(false);
      setCompleted(false);
    } else if (order.orderStatus === "CANCELLED") {
      setPending(false);
      setAccepted(false);
      setRejected(true);
      setCompleted(false);
    } else if (order.orderStatus === "COMPLETED") {
      setPending(false);
      setAccepted(false);
      setRejected(false);
      setCompleted(true);
    }
  }, [order]);


  const clickA = async () => {
    setAccepted(true);
    setPending(false);
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/acceptorder`,
        {
          method: "PUT",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACCEPTED" }),
        }
      );
      if (response.ok) {
        toast.success("Order accepted successfully! Reloading...");
        setTimeout(() => {
        window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clickR = async () => {
    setPending(false);
    setRejected(true);
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/rejectorder`,
        {
          method: "PUT",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "REJECTED" }),
        }
      );
      if (response.ok) {
        toast.success("Order rejected successfully! Reloading...");
        setTimeout(() => {
        window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clickC = async () => {
    setPending(false);
    setCompleted(true);
    try {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/completeorder`,
        {
          method: "PUT",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "COMPLETED" }),
        }
      );
      if (response.ok) {
        toast.success("Order completed successfully! Reloading...");
        setTimeout(() => {
        window.location.reload();
        }, 5000);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoBack = () => {
    window.history.back()
  };




  return (
    <div>
        <SellerNavigationBar/>
        <ToastContainer/>
        <br/>
        <div style={{width: 220}}>
            <div className="button1" onClick={handleGoBack} ><FaArrowLeft/> <div style={{width:5}}></div>Back to orders</div>
        </div>
        <br/>
      <h1 style={{marginLeft: 80}}>Order ID #{order.orderId}</h1>
      <div id="listingContainer">
        <div id="leftListingContainer">

          <Flex justifyContent={"space-between"}></Flex>
          <br />
            <img style={{width: 600, borderRadius:"10px", marginRight:80}}alt="listing pic" src={url}></img>
          <br />
          <div id="listingDetailsGrid"></div>
          <br />
        </div>
        <div id="rightListingContainer">
            <br/>
            <h3 className="listingH3">Buyer</h3>
          <h2 className="listingH2">@{buyer.username}</h2>



          <h3 className="listingH3">Description:</h3>
          <h2 className="listingH2">{order.description}</h2>
          <h3 className="listingH3">Address:</h3>
          <h2 className="listingH2">{order.address}</h2>
          <h3 className="listingH3">Collection Date:</h3>
          <h2 className="listingH2">{formatDate(order.dateOfCollection)}</h2>
          <h3 className="listingH3">Order Status:</h3>
          <h2 className="listingH2">{order.orderStatus}</h2>
          <Flex>
                <div>
                    <h3 className="listingH3">Price:</h3>
                      <h2 className="listingH2">${formatPrice(order.price)}</h2>
                </div>
                <div style={{width: 40}}></div>
                <div>
                    <h3  className="listingH3">Quantity:</h3>
                         <h2 className="listingH2">{order.quantity}</h2>
                </div>
                <div style={{width: 40}}></div>
                <div>
                    <h3  className="listingH3">Total amount:</h3>
                     <h2 className="listingH2">${formatPrice(parseFloat(order.quantity) * parseFloat(order.price))}</h2>
                </div>
            </Flex>
          <br></br>
          <Flex>
            {isPending && !isRejected && (
              <div className="button1" onClick={clickA}>
                <FaCheck />
                Accept
              </div>
            )}
            {isPending && !isRejected &&  (
              <div className="button1" onClick={clickR}>
                <FaTimes />
                Reject
              </div>
            )}
            {isAccepted && !isRejected && (
              <div className="button1" onClick={clickC}>
                <FaRegStar />
                Complete
              </div>
            )}
          </Flex>
        </div>
      </div>
    </div>
  );
}

export default SellerViewOrder;
