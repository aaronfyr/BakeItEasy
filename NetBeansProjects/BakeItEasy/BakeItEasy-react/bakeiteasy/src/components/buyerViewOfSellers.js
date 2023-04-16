import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "./resources/homepageShopping.css";
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
import { toast, ToastContainer } from "react-toastify";
import { FiHeart, FiGlobe, FiUsers } from "react-icons/fi";
import { FaMitten } from "react-icons/fa";
import ReactLoading from "react-loading";
import { ListingSellerHeader } from "./listingSellerHeader";

import SellerCard from "../components/sellerCard";

export const BuyerViewOfSellers = () => {
  let navigate = useNavigate();

  // fetch buyer
  const [buyer, setBuyer] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const buyer = localStorage.getItem("buyer");
      if (!buyer) {
        console.log("homepage: ", "has no buyer");
        navigate("/login");
      } else {
        console.log("homepage: ", "has buyer");
        const parsedUser = JSON.parse(buyer);
        setBuyer(parsedUser);
      }
    }
    fetchData();
  }, []);

  // fetch current buyer followings
  const [followings, setFollowings] = useState();
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
        setFollowings(data.map((fol) => fol.sellerId));

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

  // fetch sellers
  const [sellers, setSellers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/sellers/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setSellers(data);
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

  // fetch listings by followed sellers
  const [fListings, setFListings] = useState([]);
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
          `http://localhost:8080/BakeItEasy-war/webresources/listings/${buyerId}/followed`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setFListings(data);
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

  // fetch current buyer followings listings
  /*
  const [followedListings, setFollowedListings] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/listings/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log(
          "data: ",
          data.filter((product) => {
            console.log("followings: ", followings);
            console.log(
              "comparing followings: ",
              getSellerId(product.listingId),
              followings.includes(getSellerId(product.listingId))
            );
            return followings.includes(getSellerId(product.listingId));
          })
        );
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

  // fetch listings with sellers
  
  const [listings, setListings] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/listings/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        data.forEach(async (obj) => {
          const lId = obj.listingId;
          obj.sellerFetchAttempt = true;

          try {
            const response = await fetch(
              `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/seller`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            const data = await response.json();
            //console.log(`HTTP Response Code: ${response?.status}`);
            //console.log("sellerId: ", data.sellerId);
            //console.log("sellerUsername: ", data.username);
            //console.log("sellerName: ", data.name);
            obj.seller = data;
            obj.sellerId = data.sellerId;
            obj.sellerUsername = data.username;
            obj.sellerName = data.name;
          } catch (error) {
            if (error instanceof SyntaxError) {
              // Unexpected token < in JSON
              console.log("There was a SyntaxError", error);
            }
            obj.sellerId = "User not found";
            obj.sellerUsername = "User not found";
            obj.sellerName = "User not found";
          }
        }); // wasn't here before
        setListings(data);
        console.log("listings during useffect: ", listings);
        console.log(
          "listings[0].sellerName during useffect: ",
          listings[0].sellerName
        );
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
  */

  //listings.forEach((obj) => getSeller(obj));

  // handle filter by category
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [categories, setCategories] = useState([
    { name: "Savory" },
    { name: "Bread" },
    { name: "Cake" },
    { name: "Cupcake" },
    { name: "Tart" },
    { name: "Pie" },
  ]);

  const handleFilterByCateory = (categoryName) => {
    const categoryNameLowerCase = categoryName.toLowerCase();
    if (categoryFilter === categoryNameLowerCase) {
      // set category status to not selected

      setCategoryFilter(null);
    } else {
      // set category status to selected

      console.log("filter category: ", categoryName);
      setCategoryFilter(categoryName.toLowerCase());
    }
  };

  // handleSearch
  const [search, setSearch] = useState("");
  const handleSearch = (event) => {
    console.log("search: ", search);
    event.preventDefault();
    const searchLowerCase = event.target.value.toLowerCase();
    setSearch(searchLowerCase);
  };

  // routeChangeToListing
  const routeChangeToListing = (listingId) => {
    console.log("routechangetolisting: ", listingId);
    let path = "listing/";
    navigate(path + listingId);
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

  let filteredSellersCount = 0;

  return (
    <div>
      <ToastContainer />

      <div className="homepageSearchBar">
        <input
          className="homepageInput"
          name="search"
          placeholder="Search by username..."
          onChange={handleSearch}
          value={search}
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
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>

      <div className="sellersDisplay">
        {sellers
          .filter((seller) => {
            if (
              seller.username &&
              seller.username.toLowerCase().includes(search)
            ) {
              return seller;
            }
            return null;
          })
          .map((seller) => {
            filteredSellersCount++;
            return seller;
          })
          .map((seller) => (
            <SellerCard
              sellerId={seller.sellerId}
              name={seller.name}
              username={seller.username}
              profilePhoto={seller.imagePath}
            />
          ))}

        {filteredSellersCount === 0 && (
          <h4 className="search">
            Unfortunately, no sellers here. Try another search...
          </h4>
        )}
      </div>
    </div>
  );
};
