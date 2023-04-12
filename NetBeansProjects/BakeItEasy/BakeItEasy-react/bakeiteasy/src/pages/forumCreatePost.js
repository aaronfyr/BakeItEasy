import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import { toast, ToastContainer } from "react-toastify";
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

import "./resources/default.css";
import "./resources/sellerViewOrder.css";
function ForumCreatePost() {
  const { id } = useParams();
  const [sellerId, setSellerId] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [buyerPost, setBuyerPost] = useState({
    post: {
      title: "",
      postCategory: "",
    },
    buyerId: 0,
  });
  const [sellerPost, setSellerPost] = useState({
    post: {
      title: "",
      postCategory: "",
    },
    sellerId: 0,
  });
  const [created, setCreated] = useState(false);

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
        setIsSeller(false);
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          console.log("parsedUser.id: ", parsedUser.buyerId);
          setBuyerId(parsedUser.buyerId);
          setBuyerPost({
            ...buyerPost,
            buyerId: buyerId,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("forum", "is seller");
        setIsSeller(true);
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
          setSellerPost({
            ...sellerPost,
            sellerId: sellerId,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  const routeChangeToForum = () => {
    let path = "/forum";
    navigate(path);
  };
  const handleGoBack = () => {
    window.history.back();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (isSeller) {
      if (name === "postCategory") {
        setSellerPost((prevPost) => ({
          ...prevPost,
          postCategory: value,
        }));
      } else {
        setSellerPost((prevPost) => ({
          ...prevPost,
          [name]: value,
        }));
      }
    } else {
      if (name === "postCategory") {
        setBuyerPost((prevPost) => ({
          ...prevPost,
          postCategory: value,
        }));
      } else {
        setBuyerPost((prevPost) => ({
          ...prevPost,
          [name]: value,
        }));
      }
    }
  };

  //create post
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSeller) {
      //seller create post
      fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buyerPost),
        }
      )
        .then((response) => {
          if (!response.ok) {
            toast.error("!response.ok");
          } else {
            console.log("listing created");
            setCreated(true);
            toast.success(
              "Post successfully created! Redirecting to profile..."
            );
            setTimeout(() => {
              routeChangeToForum();
            }, 8000); // 1000 milliseconds = 1 second
          }
          return response.json();
        })
        .then((data) => {
          // handle successful creation
        })
        .catch((error) => {
          toast.error("Failed to create listing. " + error);
        });
    } else {
      //buyer create post
      fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sellerPost),
        }
      )
        .then((response) => {
          if (!response.ok) {
            toast.error("!response.ok");
          } else {
            console.log("listing created");
            setCreated(true);
            toast.success(
              "Post successfully created! Redirecting to profile..."
            );
            setTimeout(() => {
              routeChangeToForum();
            }, 8000); // 1000 milliseconds = 1 second
          }
          return response.json();
        })
        .then((data) => {
          // handle successful creation
        })
        .catch((error) => {
          toast.error("Failed to create listing. " + error);
        });
    }
  };

  return (
    <div>
      <ToastContainer />
      <SellerNavigationBar />
      <br />
      <div style={{ width: 220 }}>
        <div className="button1" onClick={handleGoBack}>
          <FaArrowLeft />
          Back to forum
        </div>
      </div>
      <br />
      <h1 style={{ marginLeft: 450 }}>Create Post</h1>
      <div className="parent">
        <div id="rightListingContainer">
          <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <textarea
              name="title"
              value={buyerPost.title}
              onChange={handleChange}
              style={{
                minHeight: "10px",
                height: "auto",
                width: "280px",
                boxSizing: "border-box",
              }}
            />

            <label>
              Category:
              <select
                name="postCategory"
                value={buyerPost.postCategory}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="DISCUSSION">Discussion</option>
                <option value="QUESTION">Question</option>
                <option value="LOOKINGFOR">Looking For</option>
                <option value="SHARINGINGREDIENTS">Sharing Ingredients</option>
                <option value="RECIPES">Recipes</option>
              </select>
            </label>
            <button type="submit" className="button1">
              Create Post
            </button>
          </form>
          <br />
        </div>
      </div>
    </div>
  );
}

export default ForumCreatePost;
