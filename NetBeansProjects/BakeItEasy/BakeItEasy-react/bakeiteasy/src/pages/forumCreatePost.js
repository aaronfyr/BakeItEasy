import { Button, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { NavigationBar } from "../components/buyerNavigationBar";
import { SellerNavigationBar } from "../components/sellerNavigationBar";

import "./resources/default.css";
import "./resources/sellerViewOrder.css";
function ForumCreatePost() {
  const { id } = useParams();
  const [sellerId, setSellerId] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [isBuyer, setIsBuyer] = useState(false);
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
        navigate("/");
      }
      if (!fetchedSeller) {
        console.log("forum", "is buyer");
        setIsSeller(false);
        setIsBuyer(true);
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
      var validTitle =
        buyerPost.title &&
        buyerPost.title.length > 0 &&
        buyerPost.title.length < 257;
      var validCategory = buyerPost.postCategory !== "";
      if (validCategory && validTitle) {
        //buyer create post
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
              toast.error("Unable to create post.");
            } else {
              console.log("listing created");
              setCreated(true);
              toast.success(
                "Post successfully created! Redirecting to profile..."
              );
              setTimeout(() => {
                routeChangeToForum();
              }, 1000); // 1000 milliseconds = 1 second
            }
            return response.json();
          })
          .then((data) => {
            // handle successful creation
          })
          .catch((error) => {
            toast.error("Failed to create post. " + error);
          });
      }
      if (!validCategory) {
        toast.error("Select a category!");
      }
      if (!validTitle) {
        toast.error("Post must have 1 to 256 characters!");
      }
    } else {
      //buyer create post
      var validTitle2 =
        sellerPost.title &&
        sellerPost.title.length > 0 &&
        sellerPost.title.length < 257;
      console.log(sellerPost.postCategory, "validcat2");
      var validCategory2 =
        sellerPost.postCategory && sellerPost.postCategory !== "";
      if (validCategory2 && validTitle2) {
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
              }, 1000); // 1000 milliseconds = 1 second
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
      if (!validCategory2) {
        toast.error("Select a category!");
      }
      if (!validTitle2) {
        toast.error("Post must have 1 to 256 characters!");
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      {isSeller && <SellerNavigationBar />}
      {isBuyer && <NavigationBar />}
      <br />
      <div style={{ width: 220 }}>
        <div className="button1" onClick={() => handleGoBack()}>
          <HStack spacing="10px">
            <FaArrowLeft />
            <div>Back to forum</div>
          </HStack>
        </div>
      </div>
      <br />

      <div className="createPostCard">
        <h1>Create Post</h1>
        <br />
        <form className="createPostCardForm" onSubmit={handleSubmit}>
          <label>Write your post:</label>
          <textarea
            name="title"
            value={buyerPost.title}
            onChange={handleChange}
            style={{
              minHeight: "10px",
              height: "200px",
              width: "380px",
              boxSizing: "border-box",
            }}
          />
          <br />
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
          <Button
            bg="#E2725B"
            colorScheme="white"
            onClick={handleSubmit}
            w="380px"
          >
            Create Post
          </Button>
        </form>

        <br />
      </div>
    </div>
  );
}

export default ForumCreatePost;
