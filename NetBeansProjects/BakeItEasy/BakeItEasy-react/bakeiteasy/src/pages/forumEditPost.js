import { React, useEffect, useState } from "react";
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
import { FaRegCommentAlt, FaHeart } from "react-icons/fa";
import {formatPrice, formatDate} from "../components/formatter";
import "./resources/default.css";
import "./resources/listing.css";

import { NavigationBar } from "../components/buyerNavigationBar";
import { FiHeart } from "react-icons/fi";

function ForumEditPost() {
  console.log("test");
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [preDelete, setPreDelete] = useState(false);
  const [deleteFailed, setDeleteFailed]= useState(false);

  let navigate = useNavigate();
  const routeChangeToSellerProfile = () => {
    let path = "/sellerProfile";
    navigate(path);
  };

  //fetch listing deets
  useEffect(() => {
  fetch(`http://localhost:8080/BakeItEasy-war/webresources/posts/${id}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
      setPost(data);
      setLoading(false);
      console.log("response is", data)
    })
    .catch((error) => console.log("ERROR !!!!!" + error));
}, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const stopEditable = () => {
    setIsEditable(false);
  };

  const handleUpdate = () => {
  stopEditable();
  fetch(`http://localhost:8080/BakeItEasy-war/webresources/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  })
    .then((response) => {
      if (!response.ok) {
        toast.error("Update failed");
        //setDeleteFailed(true);
        throw new Error("Update failed");
      } else {
        toast.success("Post update success");
        return response.json();
      }
    })
    .then((data) => {
      // handle successful update
    })
    .catch((error) => {
      /* handle other errors */
      toast.error(error);
    });
};


  const handleDelete = () => {
    setPreDelete(false);
    stopEditable();
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/posts/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
            setDeleteFailed(true);
            setTimeout(() => {
                setDeleteFailed(false)
          }, 5000); // 1000 milliseconds = 1 second
        } else {
          console.log("response ok");

          toast.success("Post deleted successfully! Redirecting...");
          setTimeout(() => {
            routeChangeToSellerProfile();
          }, 3000); // 1000 milliseconds = 1 second
        }
        return response.json();
      })
      .then((data) => {
        // handle successful update
      })
      .catch((error) => {});
  };

  const categoryOptions = [
  "LOOKINGFOR",
  "DISCUSSION",
  "RECIPES",
  "SHARINGINGREDIENTS",
  "QUESTION"
];

  /*
  // for the image slideshow
  let slideIndex = 1;
  showSlides(slideIndex);

  // Next/previous controls
  const plusSlides = (n) => {
    showSlides((slideIndex += n));
  };

  // Thumbnail image controls
  const currentSlide = (n) => {
    showSlides((slideIndex = n));
  };

  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
  }
  */

  return (
    <div>
        <SellerNavigationBar/>
      <br />
      <ToastContainer/>

      <div style={{display: "flex"}}>
        <div style={{width:400, height:300}}></div>
        <div id="rightListingContainer">
            <h1>Post #{post.postId} </h1>
          <h3>Title:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={post.title}
              onChange={(e) =>
                setPost({ ...post, title: e.target.value })
              }
            />
          ) : (
            <h2>{post.title}</h2>
          )}
          <h3>Category:</h3>
          {isEditable ? (
  <select
    className="inputStyle"
    value={post.postCategory}
    onChange={(e) => setPost({ ...post, postCategory: e.target.value })}
  >
    {categoryOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
) : (
  <h2>{post.postCategory}</h2>
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

          <Flex>
            {isEditable && !preDelete && (
              <button className="button1" onClick={() => setPreDelete(true)}>
                Delete Post
              </button>
            )}
            {isEditable && preDelete && (
              <button className="button1" onClick={handleDelete}>
                Confirm Delete
              </button>
            )}
            {isEditable && preDelete && (
              <button className="button1" onClick={() => setPreDelete(false)}>
                Cancel Delete
              </button>
            )}
          </Flex>
          <div style={{ height: 10 }}></div>
          {deleteFailed && <h3>You cannot delete this listing.</h3>}
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default ForumEditPost;

/*
<div class="slideshow-container">
            <div class="mySlides fade">
              <div class="numbertext">1 / 3</div>
              <img src={require("../assets/teracotta.jpg")} alt="dummyimage" />
              <div class="text">Caption Text</div>
            </div>
            <div class="mySlides fade">
              <div class="numbertext">2 / 3</div>
              <img src={require("../assets/auburn.png")} alt="dummyimage" />
              <div class="text">Caption Two</div>
            </div>
            <div class="mySlides fade">
              <div class="numbertext">3 / 3</div>
              <img src={require("../assets/cardinal.png")} alt="dummyimage" />
              <div class="text">Caption Three</div>
            </div>
            <div class="prev" onClick={() => plusSlides(-1)}>
              &#10094;
            </div>
            <div class="next" onClick={() => plusSlides(1)}>
              &#10095;
            </div>
          </div>
          <br />
          <div>
            <span class="dot" onClick={() => currentSlide(1)}></span>
            <span class="dot" onClick={() => currentSlide(2)}></span>
            <span class="dot" onClick={() => currentSlide(3)}></span>
          </div>
        </div>
        */