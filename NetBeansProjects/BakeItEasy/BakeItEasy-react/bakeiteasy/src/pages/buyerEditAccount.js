import { React, useEffect, useState } from "react";
import "./resources/profile.css";

import { NavigationBar } from "../components/buyerNavigationBar";

import { useNavigate } from "react-router-dom";

import { Flex, FormLabel, Input, Image } from "@chakra-ui/react";
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
      toast.error(errorData.error);
    } else {
      console.log(buyerObj);

      localStorage.setItem("buyer", JSON.stringify(buyerObj));
      toast.success("Profile updated successfully.");
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

  return (
    <div className="background">
      <NavigationBar />
      <ToastContainer />
      <div id="coverPhoto">
        <div id="profilePhoto">
          <img
            className="homepageProfilePhotoImg"
            alt="seller pfp"
            src={buyerImagePath}
          ></img>
        </div>
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
            <h2>{buyerObj.address}</h2>
          )}
          <h3>Profile picture</h3>
          {isEditable ? (
            <>
              <Input
                type="file"
                placeholder=" "
                onChange={handleImageChange}
                accept="image/jpeg, image/png"
              />
              <Image src={buyerImagePath} />
            </>
          ) : (
            buyerImagePath && <Image src={buyerImagePath} />
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
