import { color } from "framer-motion";
import React, {useState, useEffect } from "react";
import "./resources/searchBarSection.css";
import SellerOrderCard from "./sellerOrderCard.js";
import CategoryDropdown from "../components/categoryDropdown";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import {FaListUl} from "react-icons/fa";
import {formatPrice} from "../components/formatter"
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ListingStatsMemo } from "../components/listingStatsText";

/*const orderResponse = await fetch(``)*/

const SellerViewListingList = () => {
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredListings, setFilteredListings] = useState([]);

  const [seller, setSeller] = useState(null);
  const [sellerId, setSellerId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      /*if (!fetchedBuyer) {
        console.log("navbar", "no buyer");
        navigate("/login");
      } else {*/
      if (!fetchedSeller) {
        console.log("sellerProfile", "no seller");
        navigate("/sellerlogin");
      } else {
        console.log("sellerProfile", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSeller(parsedUser);
          console.log("parsedUser: ", parsedUser);
          console.log("parsedUser.id: ", parsedUser.sellerId);
          setSellerId(parsedUser.sellerId);

        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  //get listings of seller
async function fetchListings() {
  try {
    const response = await fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/listings`, {
      //get seller id from storage !!!!!!!!!!!!!!
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setListings(data);
  } catch (error) {
    console.error(error);
  }
}

function filterListings(listings, search, selectedCategory) {
  return listings.filter((listing) => {
    if (selectedCategory === "") {
      return (
        listing.name.toLowerCase().includes(search) ||
        listing.description.toLowerCase().includes(search) ||
        listing.listingCategory.toLowerCase().includes(search)
      );
    } else {
      return (
        listing.name.toLowerCase().includes(search) &&
        listing.listingCategory.toLowerCase().includes(selectedCategory)
      );
    }
  });
}

useEffect(() => {
  fetchListings();
}, [sellerId]);

useEffect(() => {
  fetchListings();
  if (listings.length > 0) {
    const filteredData = filterListings(listings, search, "");
    setFilteredListings(filteredData);
  }
}, [listings, search]);


const handleCategoryChange = (category) => {
  const newSelectedCategory = category.toLowerCase();
  setSelectedCategory(newSelectedCategory);
  const filteredData = filterListings(listings, "", newSelectedCategory);
  setFilteredListings(filteredData);
};



   let navigate = useNavigate();
  const routeChangeToOrder = (id) => {
    let path = "listing/";
    navigate(path + id);
  };

  return (
    <div>
        <SellerNavigationBar/>
        <div className="dropdownRow">
            <div className="heading">
                <h1>My Orders</h1>
            </div>
        {/*<CategoryDropdown onCategoryChange={handleCategoryChange}/>
        <body style={{fontFamily: 'Montserrat'}}>Selected category: {selectedCategory}</body>*/}

    </div>
    <div className="searchBarSection">
      <div class="searchBar">
        <input
          className="inputMyOrdersSearch"
          onChange={(e) => {
            setSearch(e.target.value.toLowerCase());
          }}
        />
        <button className="myOrdersSearchIcon">
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
      <div className="listingDisplay">
        {filteredListings.map((listing) => (
          <div className="listingComp" >
            <SellerOrderCard>
            <div className="sellerOrderCardHeader">
            </div>
            <div className="sellerOrderCardBodyFlex">
                <div className="sellerOrderCardBodyFlex">
                    <img alt="cake" style={imgStyle} src={listing.imagePaths[0] ? listing.imagePaths[0] : "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NHx8fGVufDB8fHx8&w=1000&q=80"}/>
                </div>

                <div style={{width: 400}} className="cardTextBlock">
                    <h2 style={{fontWeight:"bolder"}}>{listing.name} [${formatPrice(listing.price)}]</h2>
                    {!listing.listingCategory && <h4>loading...</h4>}
                    {listing.listingCategory && <h4>{listing.listingCategory.toLowerCase()}</h4>}
                    <div className="flexBox">
                        <div className="searchBarButton1" onClick={() => (routeChangeToOrder(listing.listingId))}>
                            <FaListUl style={{alignSelf: "center"}}/>
                            <h3>View orders</h3>
                        </div>
                    </div>
                </div>
                <div>
                    <br/>
                    <ListingStatsMemo lId={listing.listingId}/>
                </div>
            </div>
        </SellerOrderCard>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};


const pfpStyle = {padding: 0.5, borderRadius: "50%", width: 30, height: 30,
                    objectFit: "cover", background: "grey", display:"block" }

const imgStyle = {height: 150, width: 150, objectFit:"cover", borderRadius: 10, marginRight:20}



export default SellerViewListingList;
