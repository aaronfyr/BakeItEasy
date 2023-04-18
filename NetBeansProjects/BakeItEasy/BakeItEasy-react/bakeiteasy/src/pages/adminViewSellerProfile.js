import { HStack, Spacer } from "@chakra-ui/react";
import { React, useEffect, useState } from "react";
import { FaPlus, FaRegEdit, FaRegStar, FaRegUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatPrice } from "../components/formatter";
import AdminMenuBar from "../components/adminMenuBar";
import "./resources/sellerProfile.css";
import { useLocation } from "react-router-dom";

function AdminViewSellerProfile() {
  const sellerId = new URLSearchParams(useLocation().search).get("id");
  const [search, setSearch] = useState("");
  const [sellerObj, setSellerObj] = useState([]);
  const [followerCount, setFollowerCount] = useState(404);

  const navigate = useNavigate();
  const stars = [];

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
    let path = "/adminViewSellerListing/";
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

  const routeToOrderMgmt = () => {
    console.log("Navigate to: ", "orderManagement");
    navigate("/adminViewSellerOrderMgmt?id=" + sellerId);
  };

  return (
    <div>
      <ToastContainer />
      <AdminMenuBar />
      <br />
      <div id="coverPhoto">
        <div id="profilePhoto">
          <img
            alt=""
            style={{ height: 120, objectFit: "cover" }}
            src={
              sellerObj.imagePath
                ? sellerObj.imagePath
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
          ></img>
        </div>
      </div>
      <HStack>
        <div id="userDetails">
          <h1>{sellerObj.name}</h1>
          <h5>@{sellerObj.username}</h5>
        </div>
        <Spacer />
        <div
          className="editProfileBtn"
          onClick={() => routeToOrderMgmt()}
        >
          <FaRegEdit style={{ marginRight: 5 }} />
          View orders
        </div>
      </HStack>
      <h2>Search listings:</h2>
      <div class="searchBar2">
        <input
          className="profileSearchInput"
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
          }}
        />
      </div>
      <br />
      <div className="contentGrid">
        <div div className="flexGrowBox">
          <div div className="flexGrowBox_header">
            <h1>Seller Products</h1>
          </div>
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
                    src={
                      listing.imagePaths[0]
                        ? listing.imagePaths[0]
                        : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                    }
                    alt="listing product"
                  />
                </div>
                <div class="productBottomRow">
                  <h3>${formatPrice(listing.price)} </h3>
                </div>
                <h5 style={{ color: "#636363" }}>{listing.description}</h5>
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
                  <h2>rating: {review.rating} / 5</h2>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminViewSellerProfile;
