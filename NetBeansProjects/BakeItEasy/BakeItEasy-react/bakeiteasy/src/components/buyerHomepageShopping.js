import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "./resources/homepageShopping.css";

import { FiHeart } from "react-icons/fi";

export const BuyerShopping = () => {
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

  const [categories, setCategories] = useState([
    { name: "Savory" },
    { name: "Breads" },
    { name: "Cakes" },
    { name: "Cupcakes" },
    { name: "Tarts" },
    { name: "Pies" },
    { name: "Wedding" },
    { name: "Graduation" },
    { name: "Cookies" },
    { name: "Halal" },
    { name: "Fried" },
    { name: "Fruits" },
  ]);

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

  let navigate = useNavigate();
  const routeChangeToListing = (listingId) => {
    console.log("routechangetolisting: ", listingId);
    let path = "listing/";
    navigate(path + listingId);
  };

  const [search, setSearch] = useState("");

  /*
  const filteredListings = listings.filter((product) => {
    console.log("changing filteredListings");
    if (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    ) {
      return product;
    }
    return null;
  });
*/

  // handle search
  const handleSearch = (event) => {
    console.log("search: ", search);
    event.preventDefault();
    setSearch(event.target.value);
  };

  /*
  if (search.length > 0) {
    console.log("search by " + search);
    console.log("listings: ", listings.length);
    let counter = 0;
    listings.filter((product) => {
      if (
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      ) {
        counter++;
        return product;
      }
      return null;
    });
    setListings(filteredListings);
    console.log("listings passed count: ", counter);
    console.log("filtered listings: ", listings.length);
  }
*/

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
    } else {
      // show error message
      setLikeListingError("Invalid details. Please try again.");
    }
  };

  let filteredListingsCounterExplore = 0;
  let filteredListingsCounterFollowed = 0;

  return (
    <div>
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
        <div className="categoriesDisplay">
          {categories.map((category) => (
            <div className="category">{category.name}</div>
          ))}
        </div>
      </div>

      <div class="shoppingHeader">Followed Bakers</div>

      <div className="listingsDisplay">
        {listings
          .filter((product) => {
            if (
              product.name.toLowerCase().includes(search) ||
              product.description.toLowerCase().includes(search)
            ) {
              console.log(product);
              filteredListingsCounterFollowed++;
              console.log(
                "filteredListings count: ",
                filteredListingsCounterFollowed
              );
              return product;
            }
            return null;
          })
          .map((product) => (
            <div
              className="product"
              onClick={() => routeChangeToListing(product.listingId)}
            >
              <div class="productSeller">
                <img
                  width="30px"
                  height="30px"
                  src={require("../assets/dummyuser.png")}
                  alt="listing product"
                />
                <h6>seller name</h6>
              </div>
              <div className="productImg">
                <img
                  className="productImg"
                  src={require("../assets/scones.jpg")}
                  alt="listing product"
                />
              </div>
              <h3>{product.name}</h3>
              <h5>{product.description}</h5>
              <div class="productBottomRow">
                <FiHeart
                  size="1.2rem"
                  onClick={() => handleListingToLikes(product.listingId)}
                />
                <h3>${product.price}</h3>
              </div>
            </div>
          ))}

        {filteredListingsCounterFollowed === 0 && (
          <h4 className="search">
            Unfortunately, no such Baked Listing. Try another search?
          </h4>
        )}
      </div>

      <div class="shoppingHeader">Explore More Bakers</div>
      <div className="listingsDisplay">
        {listings
          .filter((product) => {
            if (
              product.name.toLowerCase().includes(search) ||
              product.description.toLowerCase().includes(search)
            ) {
              console.log(product);
              filteredListingsCounterExplore++;
              console.log(
                "filteredListings count: ",
                filteredListingsCounterExplore
              );
              return product;
            }
            return null;
          })
          .map((product) => (
            <div
              className="product"
              onClick={() => routeChangeToListing(product.listingId)}
            >
              <div class="productSeller">
                <img
                  width="30px"
                  height="30px"
                  src={require("../assets/dummyuser.png")}
                  alt="listing product"
                />
                <h6>seller name</h6>
              </div>
              <div className="productImg">
                <img
                  className="productImg"
                  src={require("../assets/scones.jpg")}
                  alt="listing product"
                />
              </div>
              <h3>{product.name}</h3>
              <h5>{product.description}</h5>
              <div class="productBottomRow">
                <FiHeart size="1.2rem" />
                <h3>${product.price}</h3>
              </div>
            </div>
          ))}
        {filteredListingsCounterExplore === 0 && (
          <h4 className="search">
            Unfortunately, no such Baked Listing. Try another search?
          </h4>
        )}
      </div>
    </div>
  );
};
