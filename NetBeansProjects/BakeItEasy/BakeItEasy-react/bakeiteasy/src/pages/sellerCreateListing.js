import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
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
import {
  FaRegCommentAlt,
  FaHeart,
  FaCheck,
  FaTimes,
  FaRegStar,
  FaArrowLeft
} from "react-icons/fa";

import "./resources/default.css";
import "./resources/sellerViewOrder.css";
function SellerCreateListing() {
  const { id } = useParams();
  const [seller, setSeller] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [listing, setListing] = useState({
    name: '',
    listingCategory: '',
    price: '',
    quantityLeft: '',
    description: '',
    imagePaths: []
  });
  const [created, setCreated] = useState(false);

  const navigate = useNavigate();

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

   const routeChangeToSellerProfile = () => {
    let path = "/sellerProfile";
    navigate(path);
  };

//fetch seller
  //console.log("sellerID is", sellerId);
  useEffect(() => {
    if (sellerId){
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch seller");
        }
        return response.json()
      }
      )
      .then((data) => setSellerObj(data));
    }
  }, [sellerId]);

  const handleGoBack = () => {
    window.history.back()
  };

const handleChange = (event) => {
  const { name, value } = event.target;

  if (name === "listingCategory") {
    setListing((prevListing) => ({
      ...prevListing,
      listingCategory: value,
    }));
  } else {
    setListing((prevListing) => ({
      ...prevListing,
      [name]: value,
    }));
  }
};


  //create listing
  const handleSubmit = e => {
    e.preventDefault();

    fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${sellerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listing)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create listing');
        } else {
          console.log("listing created");
          setCreated(true);
          setTimeout(() => {
            routeChangeToSellerProfile();
          }, 3000); // 1000 milliseconds = 1 second
        }
        return response.json();
      })
      .then(data => {
        // handle successful creation
      })
      .catch(error => {});
  };


  return (
    <div>
        <SellerNavigationBar/>
        <br/>
        <div style={{width: 220}}>
            <div className="button1" onClick={handleGoBack} ><FaArrowLeft/>Back to profile</div>
        </div>
        <br/>
        <div className="parent">
            <div id="rightListingContainer">
                <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={listing.name} onChange={handleChange} />
      </label>
      <label>
        Category:
            <select name="listingCategory" value={listing.listingCategory} onChange={handleChange}>
                <option value="">Select a category</option>
                <option value="SAVORY">Savory</option>
                <option value="BREAD">Bread</option>
                <option value="CAKE">Cake</option>
                <option value="MUFFINCUPCAKE">Muffin/Cupcake</option>
                <option value="PASTRYTART">Pastry/Tart</option>
                <option value="PIE">Pie</option>
            </select>
        </label>
      <label>
        Price:
        <input type="text" name="price" value={listing.price} onChange={handleChange} />
      </label>
      <label>
        Quantity:
        <input type="text" name="quantityLeft" value={listing.quantityLeft} onChange={handleChange} />
      </label>
      <label>
        Description:
        <input type="text" name="description" value={listing.description} onChange={handleChange} />
      </label>
      <label>
        Image Paths:
        <input type="text" name="imagePaths" value={listing.imagePaths} onChange={handleChange} />
      </label>
      <button type="submit" className="button1">Create Listing</button>
    </form>
    <br/>
    {created && <h1>created successfully! please wait, redirecting to profile...</h1>}
            </div>
        </div>
    </div>
  );
}

export default SellerCreateListing;
