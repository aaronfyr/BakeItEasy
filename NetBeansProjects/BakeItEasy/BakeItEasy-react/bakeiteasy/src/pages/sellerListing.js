import { React, useEffect, useState } from "react";
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
import { FaRegCommentAlt, FaHeart } from "react-icons/fa";

import "./resources/default.css";
import "./resources/listing.css";

import { NavigationBar } from "../components/buyerNavigationBar";

function SellerListing() {
  console.log("test");
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [preDelete, setPreDelete] = useState(false);
  const [deleted, setDeleted] = useState(false);

  let navigate = useNavigate();
  const routeChangeToSellerProfile = () => {
    let path = "/sellerProfile";
    navigate(path);
  };

  useEffect(() => {
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const stopEditable = () => {
    setIsEditable(false);
  };

  const handleUpdate = () => {
    stopEditable();
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listing),
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
  };

  const handleDelete = () => {
    setPreDelete(false);
    stopEditable();
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update listing");
        } else {
          console.log("response ok");
          setDeleted(true);
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
      <h1>Listing ID {listing.listingId} </h1>
      <div id="listingContainer">
        <div id="leftListingContainer">
          <div class="slideshow-container"></div>
          <Flex justifyContent={"space-between"}></Flex>
          <br />

          <br />
          <div id="listingDetailsGrid"></div>
          <br />
        </div>
        <div id="rightListingContainer">
          <h3>Price:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={listing.price}
              onChange={(e) =>
                setListing({ ...listing, price: e.target.value })
              }
            />
          ) : (
            <h2>{listing.price}</h2>
          )}
          <h3>Name:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={listing.name}
              onChange={(e) => setListing({ ...listing, name: e.target.value })}
            />
          ) : (
            <h2>{listing.name}</h2>
          )}
          <h3>Description:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={listing.description}
              onChange={(e) =>
                setListing({ ...listing, description: e.target.value })
              }
            />
          ) : (
            <h2>{listing.description}</h2>
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
                Delete Listing
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
            {deleted && (
              <h1>DELETED SUCCESSFULLY! redirecting, please wait...</h1>
            )}
          </Flex>
          <div style={{ height: 10 }}></div>
          <h3>Category:</h3>
          <h2>{listing.listingCategory.toLowerCase()}</h2>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default SellerListing;

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
