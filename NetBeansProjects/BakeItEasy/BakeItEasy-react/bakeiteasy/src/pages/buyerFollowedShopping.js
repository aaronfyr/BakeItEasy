import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "../components/resources/homepageShopping.css";
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
  VStack,
} from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";
import { FiHeart, FiGlobe, FiUsers } from "react-icons/fi";
import { ListingSellerHeader } from "../components/listingSellerHeader";
import { NavigationBar } from "../components/buyerNavigationBar";
import { formatPrice, formatDate } from "../components/formatter";
import { ListingLikeButton } from "../components/listingLikeButton";

function BuyerFollowedShopping() {
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

  // fecth listing sellerId
  const getSellerId = async (lId) => {
    try {
      fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/seller`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          //console.log("sellerId: ", data.sellerId);
          return data.sellerId;
        });
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }
  };

  const [listingSellers, setListingSellers] = useState({});

  const getSellerByLId = async (lId) => {
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

      console.log("sellerUsername: ", data.username);

      setListingSellers({ ...listingSellers, [lId]: data.username });
      return data.username;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.log("There was a SyntaxError", error);
      }
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  // fetch listings
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

  let filteredListingsCounterExplore = 0;
  let filteredListingsCounterFollowed = 0;

  // if user is not logged in, redirects to homepage
  /*
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.type === "seller") {
        setSeller(parsedUser);
      } else {
        setBuyer(parsedUser);
      }
    } else {
      navigate("/login");
    }
  }, []);
  */

  return (
    <div>
      <NavigationBar />
      <ToastContainer />
      <h4 className="search">Search for baked goods:</h4>
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
      <h4 className="search">Shop by Category:</h4>

      <div class="categoriesContainer">
        <div className="homepageCategoriesDisplay">
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

      <div class="shoppingHeader">
        <HStack spacing="10px">
          <FiUsers color="#c75f4a" />
          <h1>Followed Bakers</h1>
        </HStack>
      </div>

      <div className="listingsDisplay">
        {fListings
          .filter((product) => {
            if (
              (product.name && product.name.toLowerCase().includes(search)) ||
              (product.description &&
                product.description.toLowerCase().includes(search))
            ) {
              if (
                (categoryFilter &&
                  product.listingCategory
                    .toLowerCase()
                    .includes(categoryFilter)) ||
                !categoryFilter
              ) {
                return product;
              }
            }
            return null;
          })
          .map((product) => {
            filteredListingsCounterFollowed++;
            return product;
          })
          .map((product) => (
            <div className="homepageProduct">
              <div class="productSeller">
                <ListingSellerHeader lId={product.listingId} />
              </div>
              <div
                className="homepageProductContent"
                onClick={() => routeChangeToListing(product.listingId)}
              >
                <div className="productImg">
                  <img
                    className="productImg"
                    src={
                      product.imagePaths[0]
                        ? product.imagePaths[0]
                        : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                    }
                    alt="baked listing"
                  />
                </div>
                <h3>{product.name}</h3>
                <h5>{product.description}</h5>
              </div>
              <div className="dateRow">
                <h5>{formatDate(product.dateOfCreation)}</h5>
              </div>

              <div class="productBottomRow">
                <ListingLikeButton
                  buyerId={buyer.buyerId}
                  lId={product.listingId}
                />
                <h3>${formatPrice(product.price)}</h3>
              </div>
            </div>
          ))}

        {filteredListingsCounterFollowed === 0 && (
          <h4 className="search">
            Unfortunately, no Baked Listings here. Follow more bakers!
          </h4>
        )}
      </div>
    </div>
  );
}

export default BuyerFollowedShopping;
