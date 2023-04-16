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
  Center,
} from "@chakra-ui/react";
import {
  FaRegCommentAlt,
  FaHeart,
  FaCheck,
  FaTimes,
  FaRegStar,
  FaArrowLeft,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./resources/default.css";
import "./resources/sellerViewOrder.css";

import { NavigationBar } from "../components/buyerNavigationBar";

function SellerEditProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [sendUpdate, setSendUpdate] = useState(false);

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
        navigate("/login?type=seller");
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
      fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setSellerObj(data));

  }, [sellerId]);

  const handleGoBack = () => {
    window.history.back();
  };

  const fileUpload = (newFile) => {

  // Only upload image if it's not empty
    const data = new FormData();
    data.append("file", newFile);
    data.append("upload_preset","module-buddies");
    data.append("cloud_name","nelsonchoo456");

    fetch("https://api.cloudinary.com/v1_1/nelsonchoo456/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
            toast.error("failed to upload image, try again")
          // handle error
        }
      })
      .then((data) => {
        console.log("cloud url is", data.url);
        setSellerObj((prevListing) => ({
          ...prevListing,
          imagePath: data.url,
        }));
        console.log("imagePath after setting is", sellerObj.imagePath);
        console.log(sellerObj);
        // Call second fetch after the first one finishes

      });
  };

  //edit seller
 const handleUpdate = () => {
    setIsEditable(false);

    fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sellerObj),
          }
        )
          .then((response) => {
            if (!response.ok) {
              toast.error("Failed to update profile.");
              throw new Error("Failed to update seller");
            } else {
              console.log("ok response");

              toast.success("Profile updated successfully.");
            }
            return response.json();
          })
          .then(() => {
            // handle successful update
            console.log("pretoast");
            window.location.reload();
          })
          .catch((error) => {
            /*handle error */
          });

}
;


  return (
    <div>
      <SellerNavigationBar />
      <br />
      <ToastContainer />
      <div style={{ width: 220 }}>
        <div className="button1" onClick={handleGoBack}>
          <FaArrowLeft />
          Back to profile
        </div>
      </div>
      <br />
      <div className="parent">
        <div id="rightListingContainer">
          <h1 style={{ marginLeft: 80 }}>
            Edit My Profile: Seller ID #{sellerObj.sellerId}
          </h1>
          <br/>
          <div style={{width:260, display: "block", margin: "auto"}}>
            <img style={{borderRadius: '50%', objectFit: 'cover', width: '200px', height: '200px'}}
          src={sellerObj.imagePath ? sellerObj.imagePath : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="pfp"/></div>
            <br/>
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
              onChange={(e) =>
                setSellerObj({ ...sellerObj, username: e.target.value })
              }
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
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                setSellerObj({ ...sellerObj, phoneNo: e.target.value });
              }}
            />
          ) : (
            <h2>{sellerObj.phoneNo}</h2>
          )}

           {isEditable && (
            <div>
                <input
                style={{ height: 40 }}
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
