import { React, useEffect, useState } from "react";
import "./resources/sellerProfile.css";

import { NavigationBar } from "../components/buyerNavigationBar";

import { FiHeart } from "react-icons/fi";
import { Flex, flexbox } from "@chakra-ui/react";
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
      `http://localhost:8080/BakeItEasy-war/webresources/listings/2/${buyerId}/follow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      // redirect to homepage
      console.log("likedSellerId# ", id);

      //recolor liked button
      document.getElementById("btn").style.backgroundColor = "black";
    } else {
      // show error message
      setFollowSellerError("Invalid details. Please try again.");
    }
  };

  const routeChangeToListing = (lId) => {
    let path = "/listing/" + lId;
    navigate(path);
  };
  console.log(listings);

  return (
    <div className="background">
      <NavigationBar />
      <div id="coverPhoto">
        <div id="profilePhoto"></div>
      </div>
      <Flex>
        <div id="userDetails">
          <h1>{sellerName}</h1>
          <h5>@{sellerUsername}</h5>
        </div>
        <div className="editProfileBtn" onClick={() => handleFollowSeller()}>
          Follow
        </div>
      </Flex>
      <h2>Search for Listing:</h2>
      <div class="searchBar">
        <input
          className="input"
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
          }}
        />
        <button className="button">
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
          </svg>
        </button>
      </div>

      <div className="sellerProducts">
        <Flex>
          <h1>Seller Products</h1>
        </Flex>
      </div>
      <div className="flexBox">
        <div className="profileListingsDisplay">
          {filteredListings.map((listing) => (
            <div
              className="product"
              onClick={() => routeChangeToListing(listing.listingId)}
            >
              <div class="productSeller"></div>
              <h3>{listing.name}</h3>
              <div className="productImg">
                <img
                  className="productImg"
                  src="https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                  alt="listing product"
                />
              </div>

              <div className="titleDetails">
                <h5>{listing.description}</h5>
              </div>

              <div class="productBottomRow">
                <FiHeart size="1.2rem" />
                <h3>${listing.price} </h3>
              </div>
            </div>
          ))}
        </div>
        <div className="flexGrowBox">
          <h1>Buyer Reviews</h1>
          <div className="reviewDisplay">
            {reviews.map((review) => (
              <div
                className="review"
                onClick={() => routeChangeToListing(review.id)}
              >
                <div class="productSeller">
                  <img
                    width="30px"
                    height="30px"
                    src={
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png"
                    }
                    alt="listing product"
                  />
                  <h6>buyer name</h6>
                </div>

                <div className="reviewTitle">
                  <h2>{review.title}</h2>
                </div>

                <div class="reviewBottomRow">
                  <h4>{review.reviewText}</h4>
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

/*
    {
      id: 1,
      title: "Loved the brownies",
      reviewText: "Super yummy, not too sweet, perfect with tea" ,
      date:"01-07-2022" ,
      rating:5,
    },
    {
      id: 2,
      title: "Loved the cake",
      reviewText: "For a party, kids loved it, tasty cream. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      date: "23-03-2023",
      rating:5,
    },
    {
      id: 3,
      title: "Will buy again!",
      reviewText: "Custom ordered a jelly cake with specific instructions, cake was well done to my request.Excepteur sint occaecat cupidatat non proident.",
      date: "13-05-2023" ,
      rating:5,
    },
    {
      id: 4,
      title: "Average strawberry pie",
      reviewText: "Not a bad item but costs so much and doesn't taste better than commercial pies. Excepteur sint occaecat cupidatat non proident.",
      date: "08-09-2023",
      rating:3,
    },
    {
      id: 5,
      title: "Rude seller",
      reviewText: "Took really long to reply to my requests and was rude on text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "18-02-2023" ,
      rating:1,
    }, */
