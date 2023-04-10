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
  FaArrowLeft,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./resources/default.css";
import "./resources/sellerViewOrder.css";

import { NavigationBar } from "../components/buyerNavigationBar";

function ForumEditPost() {
  const { id } = useParams();
  const [seller, setSeller] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [buyerId, setBuyerId] = useState(null);
  const [post, setPost] = useState([]);

  const navigate = useNavigate();
useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      const fetchedBuyer = localStorage.getItem("buyer");

      if (!fetchedBuyer && !fetchedSeller) {
        console.log("navbar", "no buyer or seller");
        navigate("/login");
      }
      if (!fetchedSeller) {
        console.log("forum", "is buyer");
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          console.log("parsedUser.id: ", parsedUser.buyerId);
          setBuyerId(parsedUser.buyerId);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("forum", "is seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  //fetch post
  useEffect(() => {
      fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/posts/1`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(() => {toast.success("fetched post" + id);
        ;})
        .then((response) => response.json())
        .then((data) => setPost(data));

  }, []);

  const handleGoBack = () => {
    window.history.back();
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
  };

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
            <h1>post{post.postId}</h1>
          <h1 style={{ marginLeft: 80 }}>
            Edit My Profile: Seller ID #sellerObj.sellerId
          </h1>
          <h3>Name:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={post.title}
              onChange={(e) =>
                setSellerObj({ ...post, title: e.target.value })
              }
            />
          ) : (
            <h2>{post.title}</h2>
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
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default ForumEditPost;
