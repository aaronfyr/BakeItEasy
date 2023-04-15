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

function SellerListing() {
  console.log("test");
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [preDelete, setPreDelete] = useState(false);
  const [deleteFailed, setDeleteFailed]= useState(false);
  const [likeNum, setLikeNum] = useState(404);

  let navigate = useNavigate();
  const routeChangeToSellerProfile = () => {
    let path = "/sellerProfile";
    navigate(path);
  };

  //fetch listing deets
  useEffect(() => {
  fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${id}`, {
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
      setListing(data);
      setLoading(false);
      console.log("response is", data)
    })
    .catch((error) => console.log("ERROR !!!!!" + error));
}, []);

    //fetch listing likes
  useEffect(() => {
  fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${id}/likes`, {
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
      setLikeNum(data);
      setLoading(false);
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
    if (validateListing(listing)) {

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
        toast.error("Update failed");
        //setDeleteFailed(true);
        throw new Error("Update failed");
      } else {
        toast.success("Listing update success");
        return response.json();
      }
    })
    .then((data) => {
      // handle successful update
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
    .catch((error) => {
      /* handle other errors */
      toast.error(error);
    });
    }
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
            setDeleteFailed(true);
            setTimeout(() => {
                setDeleteFailed(false)
          }, 5000); // 1000 milliseconds = 1 second
        } else {
          console.log("response ok");

          toast.success("Listing deleted successfully");
          setTimeout(() => {
            routeChangeToSellerProfile();
          }, 5000); // 1000 milliseconds = 1 second
        }
        return response.json();
      })
      .then((data) => {
        // handle successful update
      })
      .catch((error) => {});
  };

  function validateListing(listing) {
    var validated = true;
    if (listing.name.length < 1 || listing.name.length > 64) {
        toast.error("Listing name must contain 1 to 64 characters!");
        validated = false;
    }
    if (listing.price < 0) {
        toast.error("Listing price must not be negative!");
        validated = false;
    }
    if (listing.description.length < 1 || listing.description.length > 512) {
        toast.error("Listing description must contain 1 to 512 characters!");
        validated = false;
    }
    return validated;
}

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
      <h1>Listing ID {listing.listingId} </h1>
      <div id="listingContainer">
        <div id="leftListingContainer">
          {/*<div class="slideshow-container"></div>*/}
          <img alt="upload" style={{width: 700, maxHeight: 400, borderRadius:"5%", objectFit: "cover"}} src={listing.imagePaths[0]}/>
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
            <h2>${formatPrice(listing.price)}</h2>
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

          <div>
  <h3>Minimum Preparation Days:</h3>
  {isEditable ? (
    <select
      value={listing.minPrepDays}
      onChange={(e) =>
        setListing({ ...listing, minPrepDays: parseInt(e.target.value) })
      }
    >
        <option value="0">0 days</option>
      <option value="1">1 day</option>
      <option value="2">2 days</option>
      <option value="3">3 days</option>
      <option value="4">4 days</option>
      <option value="5">5 days</option>
      <option value="6">6 days</option>
      <option value="7">7 days</option>
      <option value="8">8 days</option>
      <option value="9">9 days</option>
      <option value="10">10 days</option>
    </select>
  ) : (
    <h2>{listing.minPrepDays} day(s)</h2>
  )}
</div>
<div>
  <h3>Maximum Quantity:</h3>
  {isEditable ? (
    <select
      value={listing.maxQuantity}
      onChange={(e) =>
        setListing({ ...listing, maxQuantity: parseInt(e.target.value) })
      }
    >
      {[...Array(200).keys()].map((num) => (
        <option value={num + 1}>{num + 1}</option>
      ))}
    </select>
  ) : (
    <h2>{listing.maxQuantity}</h2>
  )}

</div>


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
            <FiHeart style={{alignSelf: "center", marginTop: 5, marginRight: 10, fontSize: 20}}> </FiHeart> <h3 style={{fontSize: 20}}>{likeNum}</h3>
          </Flex>
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
          </Flex>
          <div style={{ height: 10 }}></div>
          <h3>Category:</h3>
          <h2>{(listing.listingCategory).toLowerCase()}</h2>
          {deleteFailed && <h3>You cannot delete this listing.</h3>}

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
