import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
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
import "./resources/sellerViewOrder.css";

import { NavigationBar } from "../components/buyerNavigationBar";

function SellerEditProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const navigate = useNavigate();

useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      /*if (!fetchedBuyer) {
        console.log("navbar", "no buyer");
        navigate("/login");
      } else {*/
      if (!fetchedSeller) {
        console.log("sellerProfile", "no seller");
        navigate("/sellerlogin");
      } else {
        console.log("sellerProfile", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSeller(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);

        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

    //fetch seller
  console.log("sellerID is", sellerId);
  useEffect(() => {
    if (sellerId){
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setSellerObj(data));
    }
  }, [sellerId]);


  const handleGoBack = () => {
    window.history.back()
  };

  //edit seller
  const handleUpdate = () => {
    setIsEditable(false);
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sellerObj),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update listing");
        }
        return response.json();
      })
      .then((data) => {
        // handle successful update
        window.location.reload();
      })
      .catch((error) => {
        /*handle error */
      });
  }

  return (
    <div>
        <SellerNavigationBar/>
        <br/>
        <div style={{width: 220}}>
            <div className="button1" onClick={handleGoBack} ><FaArrowLeft/>Back to profile</div>
        </div>
        <br/>
        <div className="parent">
            <div id="rightListingContainer">
            <h1 style={{marginLeft: 80}}>Edit My Profile: Seller ID #{sellerObj.sellerId}</h1>
            <h3>Name:</h3>
            {isEditable ? (
                <input
                type="text"
                className="inputStyle"
                value={sellerObj.name}
                onChange={(e) =>
                    setSellerObj({ ...sellerObj, name: e.target.value })
                }
                />
            ) : (
                <h2>{sellerObj.name}</h2>
            )}
            <h3>Username:</h3>
            {isEditable ? (
                <input
                type="text"
                className="inputStyle"
                value={sellerObj.username}
                onChange={(e) => setSellerObj({ ...sellerObj, username: e.target.value })}
                />
            ) : (
                <h2>{sellerObj.username}</h2>
            )}
            <h3>Phone:</h3>
            {isEditable ? (
                <input
                type="text"
                className="inputStyle"
                value={sellerObj.phoneNo}
                onChange={(e) =>
                    setSellerObj({ ...sellerObj, phoneNo: e.target.value })
                }
                />
            ) : (
                <h2>{sellerObj.phoneNo}</h2>
            )}
            <div style={{ height: 10 }}></div>
            <Flex>
                {!isEditable && (
                <button className="button1" onClick={() => setIsEditable(true)}>
                    Edit
                </button>
                )}
                {isEditable && (
                <button className="button1" onClick={handleUpdate}>
                    Done
                </button>
                )}
            </Flex>
            <div style={{ height: 10 }}></div>
            <h3>Email:</h3>
            <h2>{sellerObj.email}</h2>
            <br></br>
            </div>
        </div>
    </div>
  );
}

export default SellerEditProfile;
