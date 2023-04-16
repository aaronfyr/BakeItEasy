import { React, useEffect, useState } from "react";
import "./resources/default.css";

import { NavigationBar } from "../components/buyerNavigationBar";
import { BuyerShopping } from "../components/buyerHomepageShopping";
import { ListingSellerHeader } from "../components/listingSellerHeader";

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

import { FiHeart } from "react-icons/fi";

import {
  BrowserRouter as Router,
  useNavigate, // Be sure to add this import
} from "react-router-dom";

function BuyerLikedListings() {
  const navigate = useNavigate();

  // fetch buyer
  const [buyer, setBuyer] = useState(null);
  const [buyerId, setBuyerId] = useState();
  useEffect(() => {
    async function fetchData() {
      const buyer = localStorage.getItem("buyer");
      if (!buyer) {
        console.log("homepage: ", "has no buyer");
        navigate("/login");
      } else {
        try {
          console.log("homepage: ", "has buyer");
          const parsedUser = JSON.parse(buyer);
          setBuyer(parsedUser);
          setBuyerId(parsedUser.buyerId);
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
    const fetchData = async () => {
      try {
        let buyerId = null;
        const fetchedBuyer = localStorage.getItem("buyer");
        if (!fetchedBuyer) {
          navigate("/login");
        } else {
          const parsedUser = JSON.parse(fetchedBuyer);
          buyerId = parsedUser.buyerId;
        }

        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/buyers/${buyerId}/likedlistings/`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setListings(data);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, listings); // IDK IF THIS IS GOOD CODE BUT THIS IS THE ONLY WAY page refreshes after removing anything from listings

  console.log("listings: ", listings);

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
    let path = "/listing/";
    navigate(path + listingId);
  };

  // handleRemoveFromLikedListings
  const [likeListingError, setLikeListingError] = useState(null);
  const handleRemoveFromLikedListings = async (lId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/${buyer.buyerId}/unlike`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      // redirect to homepage
      const newListings = listings.filter((obj) => {
        return obj.listingID !== lId;
      });
      setListings(newListings);
      console.log("unlikedListing# ", lId);
      // success message
    } else {
      // show error message
      setLikeListingError("Invalid details. Please try again.");
    }
  };

  let filteredListingsCounterFollowed = 0;

  return (
    <div className="background">
      <NavigationBar />
      <br />
      <div class="shoppingHeader">Liked Listings</div>
      <br />
      <div className="homepageSearchBar">
        <input
          className="homepageInput"
          name="search"
          placeholder="Search for Bake Listing here"
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
      <h4 className="search">View by Category:</h4>

      <div class="categoriesContainer">
        <div className="categoriesDisplay">
          {categories.map((category) => (
            <Flex>
              <div
                className="category"
                onClick={() => handleFilterByCateory(category.name)}
              >
                {category.name}
              </div>
            </Flex>
          ))}
        </div>
      </div>

      <div className="listingsDisplay">
        {listings
          .filter((product) => {
            if (
              product.name.toLowerCase().includes(search) ||
              product.description.toLowerCase().includes(search)
            ) {
              //console.log("map: categoryFilter:", categoryFilter);
              //console.log(
              //"map: product.listingCategory:",
              //product.listingCategory
              //);
              if (
                (categoryFilter &&
                  product.listingCategory
                    .toLowerCase()
                    .includes(categoryFilter)) ||
                !categoryFilter
              ) {
                //console.log(product);
                filteredListingsCounterFollowed++;
                //console.log(
                //"filteredListings count: ",
                //filteredListingsCounterFollowed
                //);
                return product;
              }
            }
            return null;
          })
          .map((product) => (
            <div className="product">
              <div onClick={() => routeChangeToListing(product.listingId)}>
                <div class="productSeller">
                  <ListingSellerHeader lId={product.listingId} />
                </div>
                <div className="productImg">
                  <img
                    className="productImg"
                    src={product.imagePaths[0]}
                    alt="listing product"
                  />
                </div>

                <h3>{product.name}</h3>

                <h5>{product.description}</h5>
              </div>
              <div class="productBottomRow">
                <div
                  class="btn"
                  onClick={() =>
                    handleRemoveFromLikedListings(product.listingId)
                  }
                >
                  <img
                    className="heartBreakIcon"
                    src={require("../assets/heart-broken-icon.png")}
                    height="0.8rem"
                    width="0.8rem"
                    alt="unlike"
                  />
                </div>
                <h3>${product.price}</h3>
              </div>
            </div>
          ))}

        {filteredListingsCounterFollowed === 0 && (
          <h4 className="search">
            Unfortunately, no Baked Listings here. 'Like' more Listings!
          </h4>
        )}
      </div>
    </div>
  );
}

export default BuyerLikedListings;
