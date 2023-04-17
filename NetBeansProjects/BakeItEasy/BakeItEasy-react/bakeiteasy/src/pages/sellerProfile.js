import { React, useEffect, useState } from "react";
import "./resources/sellerProfile.css";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import { FaRegEdit, FaRegUser, FaPlus } from "react-icons/fa";
import { Flex, flexbox } from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatPrice } from "../components/formatter";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { FaRegStar } from "react-icons/fa";

function SellerProfile(props) {
  const [search, setSearch] = useState("");

  const [seller, setSeller] = useState(null);
  const [sellerName, setSellerName] = useState("Log In");
  const [sellerUsername, setSellerUsername] = useState("");
  const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState([]);
  const [followerCount, setFollowerCount] = useState(404);

  const navigate = useNavigate();

  const { review } = props;
  const stars = [];



  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      /*if (!fetchedBuyer) {
        console.log("navbar", "no buyer");
        navigate("/login");
      } else {*/
      if (!fetchedSeller) {
        console.log("sellerProfile", "no seller");
        navigate("/login");
      } else {
        console.log("sellerProfile", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSeller(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);
          setSellerName(parsedUser.name);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // fetch listings
  const [listings, setListings] = useState([]);
  useEffect(() => {
    console.log("fetching listings for " + sellerId);
    fetch(

      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/listings`,
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
  }, [sellerId]);

  // fetch reviews
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/reviews`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        for (let i = 0; i < data.rating; i++) {
         stars.push(<FaRegStar key={i} />);
        }
    });
  }, [sellerId, stars]);

  //fetch seller
  useEffect(() => {
    if (sellerId) {
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
    }
  }, [sellerId]);

  //fetch seller follower count
  useEffect(() => {
    if (sellerId) {
      fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/followers`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setFollowerCount(data.length));
    }
  }, [sellerId]);

  const filteredListings = listings.filter(
    (listing) =>
      (listing.name && listing.name.toLowerCase().includes(search)) ||
      (listing.description &&
        listing.description.toLowerCase().includes(search)) ||
      (listing.category && listing.category.toLowerCase().includes(search))
  );

  const routeChangeToListing = (id) => {
    let path = "/sellerListing/";
    navigate(path + id);
  };

  const routeChangeToSellerEditProfile = () => {
    let path = "/editSellerProfile";
    navigate(path);
  };

  const routeChangeToCreateListing = () => {
    let path = "/sellerCreateListing";
    navigate(path);
  };

  const routeChangeToViewFollowers = () => {
    let path = "/sellerViewFollowers";
    navigate(path);
  };

  return (
    <div className="background">
      <ToastContainer />
      <SellerNavigationBar />
      <div id="coverPhoto">
        <div id="profilePhoto">
            <img alt="" style={{height: 120, objectFit: "cover"}}
            src = {sellerObj.imagePath? sellerObj.imagePath : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} ></img>
        </div>
      </div>
      <Flex>
        <div id="userDetails">
          <h1>{sellerObj.name}</h1>
          <h5>@{sellerObj.username}</h5>
        </div>

        <div
          className="editProfileBtn"
          onClick={() => routeChangeToSellerEditProfile()}
        >
          <FaRegEdit style={{ marginRight: 5 }} />
          Edit profile
        </div>
        <div
          className="followersBtn"
          onClick={() => routeChangeToViewFollowers()}
        >
          <FaRegUser style={{ marginRight: 5 }} />
          {followerCount} Follower(s)
        </div>
      </Flex>
      <h2>Search for my listing:</h2>
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
            stroke="black"
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

      {/*NAVBAR HERE BUT IT DOESNT WORK IDK WHY */}
      <div className="sellerProducts">
        <Flex>
          <h1>Seller Products</h1>
          <div
            className="newListBtn"
            onClick={() => routeChangeToCreateListing()}
          >
            <FaPlus style={{ alignSelf: "center", paddingRight: 5 }} />
            create listing
          </div>
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
                  src={listing.imagePaths[0] ? listing.imagePaths[0] : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"}
                  alt="listing product"
                />

              </div>
              <div class="productBottomRow">
                <h3>${formatPrice(listing.price)} </h3>
              </div>
              <h5 style={{color: "#636363"}}>{listing.description}</h5>
            </div>
          ))}
        </div>
        <div className="flexGrowBox">
          <h1>Buyer Reviews</h1>
          <div className="reviewDisplay">
            {reviews.map((review) => (
              <div
                className="review"

              >

                <div className="reviewTitle">
                  <h2 style={{marginTop: 10}}>{review.title}</h2>
                </div>

                <div class="reviewBottomRow">
                  <h4 style={{marginLeft:10}}>{review.reviewText}</h4>
                  <h2>Rating: {review.rating} / 5</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerProfile;

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
