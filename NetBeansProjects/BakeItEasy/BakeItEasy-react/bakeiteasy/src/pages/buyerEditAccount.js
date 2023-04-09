import { React, useEffect, useState } from "react";
import "./resources/profile.css";

import { NavigationBar } from "../components/buyerNavigationBar";

import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  Flex,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { FaEdit, FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BuyerEditAccount() {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState("Log In");
  const [buyerId, setBuyerId] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerUsername, setBuyerUsername] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhoneNo, setBuyerPhoneNo] = useState("");

  useEffect(() => {
    async function fetchData() {
      const fetchedBuyer = localStorage.getItem("buyer");
      if (!fetchedBuyer) {
        console.log("profile", "no buyer");
        navigate("/login");
      } else {
        console.log("profile", "has buyer");
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.name: ", parsedUser.name);
          setBuyerName(parsedUser.name);
          setBuyerId(parsedUser.buyerId);
          setBuyerEmail(parsedUser.email);
          setBuyerUsername(parsedUser.username);
          setBuyerAddress(parsedUser.address);
          setBuyerPhoneNo(parsedUser.phoneNo);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // fetch buyer
  console.log("buyerID is", buyerId);
  useEffect(() => {
    if (buyerId) {
      fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setBuyerObj(data));
    }
  }, [buyerId]);

  console.log("buyerId:", buyerId);

  //edit buyer
  const [isEditable, setIsEditable] = useState(false);
  const [buyerObj, setBuyerObj] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const handleUpdate = async () => {
    setIsEditable(false);

    console.log("handleUpdate: ", "in");
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buyerObj),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error);
    } else {
      toast.success("Profile updated successfully.");
    }
  };

  // routing
  const routeChangeToProfile = () => {
    navigate(`/buyerProfile/${buyerId}`);
  };
  return (
    <div className="background">
      <NavigationBar />
      <ToastContainer />
      <div id="coverPhoto">
        <div id="profilePhoto"></div>
      </div>
      <Flex justifyContent={"space-between"}>
        <div id="userDetails">
          <h1>{buyerName}</h1>

          <h4>details</h4>
        </div>
        <Flex>
          <div className="button1" onClick={() => routeChangeToProfile()}>
            Back to Profile
            <FaArrowRight />
          </div>
        </Flex>
      </Flex>
      <div className="parent">
        <div id="rightListingContainer">
          <h1 style={{ marginLeft: 80 }}>
            Edit My Profile: Buyer ID #{buyerId}
          </h1>
          <h3>Name:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={buyerObj.name}
              onChange={(e) =>
                setBuyerObj({ ...buyerObj, name: e.target.value })
              }
            />
          ) : (
            <h2>{buyerObj.name}</h2>
          )}
          <h3>Username:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={buyerObj.username}
              onChange={(e) =>
                setBuyerObj({ ...buyerObj, username: e.target.value })
              }
            />
          ) : (
            <h2>{buyerObj.username}</h2>
          )}
          <h3>Phone:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={buyerObj.phoneNo}
              onChange={(e) =>
                setBuyerObj({ ...buyerObj, phoneNo: e.target.value })
              }
            />
          ) : (
            <h2>{buyerObj.phoneNo}</h2>
          )}
          <h3>Address:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={buyerObj.address}
              onChange={(e) =>
                setBuyerObj({ ...buyerObj, address: e.target.value })
              }
            />
          ) : (
            <h2>{buyerObj.phoneNo}</h2>
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
          <h2>{buyerEmail}</h2>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default BuyerEditAccount;
