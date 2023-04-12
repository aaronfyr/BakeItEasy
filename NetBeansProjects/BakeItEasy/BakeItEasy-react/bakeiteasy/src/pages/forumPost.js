import { color } from "framer-motion";
import React, { useState, useEffect } from "react";
import "./resources/sellerViewFollowers.css";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import { NavigationBar } from "../components/buyerNavigationBar";
import { FaRegEdit } from "react-icons/fa";
import { formatDate } from "../components/formatter";
import Comment from "../components/comment";
import { toast, ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";

/*const orderResponse = await fetch(``)*/

function ForumPost() {
  const [comments, setComments] = useState([]);
  const [buyerId, setBuyerId] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [post, setPost] = useState(null);
  const [postId, setPostId] = useState(null);
  const { id } = useParams();
  console.log("post param id ", id);

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

  // fetch post
  useEffect(() => {
    async function fetchPost() {
      try {
        console.log("fetching post");
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/posts/${id}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPost(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    }
    fetchPost();
  }, []);

  // fetch comments
  useEffect(() => {
    async function fetchPost() {
      try {
        console.log("fetching post");
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/posts/${id}/comments`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setComments(data);
        return data;
      } catch (error) {
        console.error(error);
      }
    }
    fetchPost();
  }, []);

  /*
RETRIEVE POST BY POST ID
async function fetchComments(postId) {
  if (postId) {
    console.log("sellerId", postId);
    try {
      const response = await fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${postId}/followers`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFollowers(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}*/

  /*
useEffect(() => {
    fetchFollowers(postId);
}, [postId]); */

  let navigate = useNavigate();
  if (!post || !comments) {
    return <div>Loading...</div>;
  }

  function getCategoryUrl(category) {
    switch (category) {
      case "DISCUSSION":
        return "https://cdn-icons-png.flaticon.com/512/8286/8286038.png";
      case "QUESTION":
        return "https://cdn-icons-png.flaticon.com/512/4595/4595213.png";
      case "LOOKINGFOR":
        return "https://cdn-icons-png.flaticon.com/512/3101/3101467.png";
      case "SHARINGINGREDIENTS":
        return "https://cdn-icons-png.flaticon.com/512/3038/3038135.png";
      case "RECIPES":
        return "https://cdn-icons-png.flaticon.com/512/2253/2253457.png";
      default:
        return "";
    }
  }

  console.log("comments", comments);

  return (
    <div>
      {sellerId && <SellerNavigationBar />}
      {buyerId && <NavigationBar />}
      <ToastContainer />

      <div className="dropdownRow">
        <div className="heading"></div>
      </div>
      <div className="searchBarSection">
        <div className="flex">
          <div style={{ width: 500 }}>
            <div style={{ height: 40 }}></div>
            <div className="postDiv">
              <h1>Post #{post.postId}</h1>
              <h2>{post.title}</h2>
              <h3>Category: #{post.postCategory}</h3>
              <h3>created: {formatDate(post.dateCreated)}</h3>
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  alt="categoryImg"
                  style={{ width: 120 }}
                  src={getCategoryUrl(post.postCategory)}
                />
              </div>
            </div>
            <div
              className="editPostBtn"
              onClick={() => navigate("/forum/editPost/" + id)}
            >
              <FaRegEdit style={{ alignSelf: "center" }} />
              <div style={{ width: 5 }}></div>
              <h3>edit</h3>
            </div>
          </div>
          <div className="orderDisplay">
            <div className="forumHeader">Comments</div>
            <br />
            <div style={{ overflow: "auto", height: "650px" }}>
              {comments.map((comment) => (
                <Comment
                  commentId={comment.commentId}
                  currentTitle={comment.title}
                  dateCreated={comment.dateCreated}
                  isBuyer={comment.isBuyer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pfpStyle = {
  padding: 0.5,
  borderRadius: "50%",
  width: 30,
  height: 30,
  objectFit: "cover",
  background: "grey",
  display: "block",
};

const imgStyle = {
  height: 150,
  width: 150,
  objectFit: "cover",
  borderRadius: 10,
};

export default ForumPost;
