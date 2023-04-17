import { React, useEffect, useState } from "react";
import "./resources/sellerProfile.css";
import { toast, ToastContainer } from "react-toastify";
import { NavigationBar } from "../components/buyerNavigationBar";

import { FiHeart } from "react-icons/fi";
import { Flex, flexbox, HStack } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

function BuyerViewSellerProfile() {
  const { id } = useParams();

  // fetch current buyer
  const [buyer, setBuyer] = useState();
  const [buyerId, setBuyerId] = useState();
  const [buyerProfilePhoto, setBuyerProfilePhoto] = useState();
  useEffect(() => {
    async function fetchData() {
      const fetchedBuyer = localStorage.getItem("buyer");
      if (!fetchedBuyer) {
        console.log("buyerviewofsellerprofile", "no buyer");
        navigate("/login");
      } else {
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          setBuyerId(parsedUser.buyerId);
          setBuyerProfilePhoto(parsedUser.imagePath);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  const [search, setSearch] = useState("");

  const [seller, setSeller] = useState(null);
  const [sellerName, setSellerName] = useState("Log In");
  const [sellerUsername, setSellerUsername] = useState("");
  const [sellerObj, setSellerObj] = useState([]);

  const navigate = useNavigate();

  // fetch current buyer followings
  const [followings, setFollowings] = useState();
  const [isFollowing, setIsFollowing] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let buyerId = null;
        const fetchedBuyer = localStorage.getItem("buyer");
        if (!fetchedBuyer) {
          navigate("/login");
        } else {
          const parsedUser = JSON.parse(fetchedBuyer);
          buyerId = parsedUser.buyerId;
          console.log("buyerId to get followings", buyerId);
        }

        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/followings/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setFollowings(data);
        console.log("sellerProfile, followings: ", followings);
        const checkIsFollowing = data.some(
          (val) => val.sellerId.toString() === id
        );

        setIsFollowing(checkIsFollowing);
        console.log("sellerProfile, isFollowing: ", isFollowing);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, []);

  // fetch seller
  useEffect(() => {
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSeller(data);
        setSellerName(data.name);
        setSellerUsername(data.username);
      });
  }, []);

  // fetch listings
  const [listings, setListings] = useState([]);
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/listings`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setListings(data));
  }, []);

  // fetch reviews
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/reviews`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setReviews(data));
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const filteredListings = listings.filter(
    (listing) =>
      (listing.name && listing.name.toLowerCase().includes(search)) ||
      (listing.description &&
        listing.description.toLowerCase().includes(search)) ||
      (listing.category && listing.category.toLowerCase().includes(search))
  );

  // handleFollowSeller
  const [followSellerError, setFollowSellerError] = useState(null);
  const handleFollowSeller = async () => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/${buyerId}/follow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsFollowing(true);
      toast.success(`Followed Seller!`);
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
      setFollowSellerError("Invalid details. Please try again.");
    }
  };

  // handleUnfollowSeller
  const [unfollowSellerError, setUnfollowSellerError] = useState(null);
  const handleUnfollowSeller = async () => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${id}/${buyerId}/unfollow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsFollowing(false);
      console.log("unfollowed SellerId# ", id);

      toast.success(`Unfollowed Seller.`);
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
      setUnfollowSellerError("Invalid details. Please try again.");
    }
  };

  // handleListingsToLikes
  const [likeListingError, setLikeListingError] = useState(null);
  const handleListingToLikes = async (lId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/${buyer.buyerId}/like`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      // redirect to homepage
      console.log("likedListing# ", lId);
      console.log("reported seller!");
      toast.success(`Liked listing # ${lId}.`);
      //recolor liked button
      document.getElementById("btn").style.backgroundColor = "black";
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
      setLikeListingError("Invalid details. Please try again.");
    }
  };

  const routeChangeToListing = (lId) => {
    let path = "/listing/" + lId;
    navigate(path);
  };

  return (
    <div className="background">
      <ToastContainer />
      <NavigationBar />
      <br />
      <div id="coverPhoto">
        <div id="profilePhoto">
          <img
            className="homepageProfilePhotoImg"
            src={
              buyerProfilePhoto
                ? buyerProfilePhoto
                : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
            }
            alt="baked listing"
          />
        </div>
      </div>
      <Flex>
        <div id="userDetails">
          <h1>{sellerName}</h1>
          <h5>@{sellerUsername}</h5>
        </div>
        {!isFollowing && (
          <div className="editProfileBtn" onClick={() => handleFollowSeller()}>
            Follow
          </div>
        )}
        {isFollowing && (
          <div
            className="editProfileBtn"
            onClick={() => handleUnfollowSeller()}
          >
            Unfollow
          </div>
        )}
      </Flex>
      <h2>Search for Listing:</h2>
      <div class="searchBar2">
        <input
          className="profileSearchInput"
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
          }}
        />
        <button className="searchIcon">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
            routeChangeToListing
          </svg>
        </button>
      </div>
      <br />
      <div className="contentGrid">
        <div div className="flexGrowBox">
          <div div className="flexGrowBox_header">
            <h1>Seller Products</h1>
          </div>
          <div className="profileListingsDisplay">
            {filteredListings.map((listing) => (
              <div className="product">
                <div class="productSeller">
                  <h3 onClick={() => routeChangeToListing(listing.listingId)}>
                    {listing.name}
                  </h3>
                </div>
                <div
                  className="productContent"
                  onClick={() => routeChangeToListing(listing.listingId)}
                >
                  <div className="productImg">
                    <img
                      className="productImg"
                      src={
                        listing.imagePaths[0]
                          ? listing.imagePaths[0]
                          : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                      }
                      alt="baked listing"
                    />
                  </div>
                  <h5>{listing.description}</h5>
                </div>
                <div class="productBottomRow">
                  <div class="btn">
                    <FiHeart
                      size="1.2rem"
                      onClick={() => handleListingToLikes(listing.listingId)}
                    />
                  </div>
                  <h3>${parseFloat(listing.price).toFixed(2)}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flexGrowBox">
          <h1>Buyer Reviews</h1>
          <div className="reviewDisplay">
            {reviews.map((review) => (
              <div className="review">
                <div className="reviewTitle">
                  <h2 style={{ marginTop: 10 }}>{review.title}</h2>
                </div>

                <div class="reviewBottomRow">
                  <h4 style={{ marginLeft: 10 }}>{review.reviewText}</h4>
                  <h2>rating: {review.rating}</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuyerViewSellerProfile;
