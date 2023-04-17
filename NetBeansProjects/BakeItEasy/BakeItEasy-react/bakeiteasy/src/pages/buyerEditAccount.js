import { React, useEffect, useState } from "react";
import "./resources/profile.css";

import { NavigationBar } from "../components/buyerNavigationBar";

import { useNavigate } from "react-router-dom";

import {
  Flex,
  FormLabel,
  Input,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "reactjs-popup/dist/index.css";

function BuyerEditAccount() {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState(null);
  const [buyerName, setBuyerName] = useState("Log In");
  const [buyerId, setBuyerId] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerUsername, setBuyerUsername] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhoneNo, setBuyerPhoneNo] = useState("");
  const [buyerImagePath, setBuyerImagePath] = useState(null);

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
          setBuyerImagePath(parsedUser.imagePath);
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
        toast.error(errorData.error + ", refreshing...", {autoClose: 2500});
        setTimeout(() => {
        window.location.reload();
      }, 2500);
    } else {
      console.log(buyerObj);

      localStorage.setItem("buyer", JSON.stringify(buyerObj));
      toast.success("Profile updated successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // routing
  const routeChangeToProfile = () => {
    navigate(`/buyerProfile/${buyerId}`);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      toast.loading("loading, please wait!");

      const fileType = file.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "module-buddies");
        data.append("cloud_name", "nelsonchoo456");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/nelsonchoo456/image/upload",
          {
            method: "POST",
            body: data,
          }
        );
        toast.dismiss();

        if (response.ok) {
          const responseData = await response.json();
          console.log("CLOUD URL", responseData.url);
          setBuyerImagePath(responseData.url);
          console.log(buyerImagePath);
          setBuyerObj({ ...buyerObj, imagePath: responseData.url });
          console.log(buyerObj);
        } else {
          const errorData = await response.json();
          toast.error(errorData.error);
        }
      } else {
        toast.error("Invalid picture format. Please try again.");
      }
    }
  };

  const fileUpload = (newFile) => {
    // Only upload image if it's not empty
    const data = new FormData();
    data.append("file", newFile);
    data.append("upload_preset", "module-buddies");
    data.append("cloud_name", "nelsonchoo456");

    fetch("https://api.cloudinary.com/v1_1/nelsonchoo456/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          toast.error("failed to upload image, try again");
          // handle error
        }
      })
      .then((data) => {
        console.log("cloud url is", data.url);

        setBuyerObj((prevListing) => ({
          ...prevListing,
          imagePath: data.url,
        }));
        console.log("imagePath after setting is", buyerObj.imagePath);
        console.log(buyerObj);
        // Call second fetch after the first one finishes
      });
  };

  return (
    <div>
      <NavigationBar />
      <br />
      <ToastContainer />

      <Flex justifyContent={"space-between"}>
        <Flex>
          <div className="button1" onClick={() => routeChangeToProfile()}>
            <HStack spacing="10px">
              <div>Back to Profile</div>
              <FaArrowRight />
            </HStack>
          </div>
        </Flex>
      </Flex>
      <div className="parent">
        <div id="rightListingContainer">
          <h1 style={{ textAlign: "center" }}>Edit My Profile</h1>
          <br />
          <div
            style={{
              width: 200,
              display: "block",
              margin: "auto",
              justifySelf: "center",
            }}
          >
            <img
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                width: "200px",
                height: "200px",
              }}
              src={
                buyerObj.imagePath
                  ? buyerObj.imagePath
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="pfp"
            />
          </div>
          <br />

          <h3 className="listingH3">Name:</h3>
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
            <h2 className="listingH2">{buyerObj.name}</h2>
          )}
          <h3 className="listingH3">Username:</h3>
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
          <h3 className="listingH3">Phone:</h3>
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
          <h3 className="listingH3">Address:</h3>
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
            <h2>{buyerObj.address}</h2>
          )}
          <div style={{ height: 10 }}></div>
          {isEditable && (
            <div>
              <input
                style={{ height: 40, width: 400 }}
                type="file"
                id="image"
                name="image"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => fileUpload(e.target.files[0])}
              />
            </div>
          )}
          <div style={{ height: 10 }}></div>
          <Flex>
            {!isEditable && (
              <Button
                bg="#E2725B"
                colorScheme="white"
                onClick={() => setIsEditable(true)}
                w="100%"
              >
                Edit
              </Button>
            )}
            {isEditable && (
              <Button
                bg="#E2725B"
                colorScheme="white"
                onClick={handleUpdate}
                w="100%"
              >
                Done
              </Button>
            )}
          </Flex>

          <div style={{ height: 10 }}></div>
          <h3 className="listingH3">Email:</h3>
          <h2 className="listingH2">{buyerEmail}</h2>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default BuyerEditAccount;
