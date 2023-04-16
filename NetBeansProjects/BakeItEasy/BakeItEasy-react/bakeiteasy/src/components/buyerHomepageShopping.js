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
  Spacer,
} from "@chakra-ui/react";
import { toast, ToastContainer } from "react-toastify";
import { FiHeart, FiGlobe, FiUsers, FiArrowRight } from "react-icons/fi";
import ReactLoading from "react-loading";
import { ListingSellerHeader } from "./listingSellerHeader";
import { formatPrice } from "./formatter";

export const BuyerShopping = () => {
  let navigate = useNavigate();

  // fetch buyer
  const [buyer, setBuyer] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const buyer = localStorage.getItem("buyer");
      if (!buyer) {
        console.log("homepage: ", "has no buyer");
        navigate("/login?type=buyer");
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
  const renderSellerListingHeader = (lId) => {
    //const detailsText = await getSellerByLId(lId);
    //return <p>{detailsText}</p>;

    if (listingSellers[lId]) {
      return <p>{listingSellers[lId]}</p>;
    } else {
      getSellerByLId(lId);
      return <ReactLoading color={"#000000"} height={"15%"} width={"15%"} />;
      //return <p>Loading...</p>;
    }
  };

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
          navigate("/login?type=buyer");
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

  // routeChangeToFollowed
  const routeChangeToFollowed = () => {
    navigate("/followed");
  };

  // routeChangeToExplore
  const routeChangeToExplore = () => {
    navigate("/explore");
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

  return (
    <div>
      <ToastContainer />
      <div className="homepageSearchBar">
        <input
          className="homepageInput"
          name="search"
          placeholder="Search for Bake Listing here"
          onChange={handleSearch}
          value={search}
        />
        {/*}
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
  </button> */}
      </div>
      <h4 className="shopByCategory">Shop by Category:</h4>

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

      <div class="altShoppingHeader">
        <div className="altShoppingHeaderTitle"></div>
        <div className="altShoppingHeaderTitle">
          <HStack spacing="10px">
            <FiUsers color="#c75f4a" />
            <h1>Followed Bakers</h1>
          </HStack>
        </div>
        <div class="shoppingHeaderLink" onClick={() => routeChangeToFollowed()}>
          <HStack spacing="5px">
            <h3>View More</h3>
            <FiArrowRight color="#c75f4a" />
          </HStack>
        </div>
      </div>

      <div className="rowListingsDisplay">
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
            if (typeof product.price === "string") {
              product.price = parseFloat(product.price);
            }
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
              <div class="productBottomRow">
                <div class="btn">
                  <FiHeart
                    size="1.2rem"
                    onClick={() => handleListingToLikes(product.listingId)}
                  />
                </div>
                <h3>${product.price}</h3>
              </div>
            </div>
          ))}

        {filteredListingsCounterFollowed === 0 && (
          <h4 className="search">
            Unfortunately, no Baked Listings here. Follow more bakers!
          </h4>
        )}
      </div>

      <div class="altShoppingHeader">
        <div className="altShoppingHeaderTitle"></div>
        <div className="altShoppingHeaderTitle">
          <HStack spacing="10px">
            <FiGlobe color="#c75f4a" />
            <h1>Explore More Bakers</h1>
          </HStack>
        </div>
        <div class="shoppingHeaderLink" onClick={() => routeChangeToExplore()}>
          <HStack spacing="5px">
            <h3>View More</h3>
            <FiArrowRight color="#c75f4a" />
          </HStack>
        </div>
      </div>
      <div className="rowListingsDisplay">
        {listings
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
                filteredListingsCounterExplore++;
                return product;
              }
            }
            return null;
          })
          .map((product) => {
            filteredListingsCounterExplore++;
            return product;
          })
          .map((product) => (
            <div className="homepageProduct">
              <div class="productSeller" key={product.listingId}>
                <ListingSellerHeader lId={product.listingId} />
              </div>
              <div
                class="homepageProductContent"
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
              <div class="productBottomRow">
                <FiHeart
                  size="1.2rem"
                  onClick={() => handleListingToLikes(product.listingId)}
                />
                <h3>${formatPrice(product.price)}</h3>
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
