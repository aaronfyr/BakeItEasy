import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import {toast, ToastContainer} from "react-toastify";
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
  const [image, setImage] = useState("");
  const [listing, setListing] = useState({
    name: '',
    listingCategory: '',
    price: '',
    quantityLeft: '',
    description: '',
    imagePaths: [],
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
toast.loading("loading, please wait!");
  e.preventDefault();
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset","module-buddies");
  data.append("cloud_name","nelsonchoo456");

  fetch("https://api.cloudinary.com/v1_1/nelsonchoo456/image/upload", {
    method: "POST",
    body: data,
  })
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      toast.dismiss();
      toast.error("rsponse for cloud upload not ok");
    }
  })
  .then((data) => {
    console.log("CLOUD URL", data.url);
    setListing(prevListing => {
      prevListing.imagePaths[0] = data.url;
    return {
    ...prevListing,
    imagePaths: prevListing.imagePaths
  };
    });
    console.log("LISTING after setlisting in 1st fetch", listing)
    console.log("image path of listings state is", listing.imagePaths[0]);
    toast.dismiss();
    toast.success("image uploaded");

    // check if imagePaths[0] is not empty before executing second fetch
    if (listing.imagePaths[0] !== "") {
      // Create the listing after image upload
      fetch(`http://localhost:8080/BakeItEasy-war/webresources/listings/${sellerId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listing),
      })
      .then((response) => {
        if (!response.ok) {
          toast.error("!response.ok");
        } else {
          console.log("listing created");
          console.log(response);
          setCreated(true);
          toast.success("Listing successfully created! Redirecting to profile...");
          setImage("");
          setTimeout(() => {
            routeChangeToSellerProfile();
          }, 5000); // 1000 milliseconds = 1 second
        }
        return response.json();
      })
      .then((data) => {
        // handle successful creation
      })
      .catch((error) => {
        toast.error("Failed to create listing. " + error);
        throw new Error("Failed to create listing");
      });
    }
  });
};


  const handlePriceChange = (e) => {
    const { value } = e.target;
    setListing({
      ...listing,
      price: value.replace(/[^0-9.]/g, ""),
    });
  };


  return (
    <div>
        <ToastContainer/>
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
      <input
        type="text"
        name="price"
        value={listing.price}
        onChange={handlePriceChange}
      />
    </label>
      <label>
        Quantity:
        <select name="quantityLeft" value={listing.quantityLeft} onChange={handleChange}>
            <option value="">-- Select quantity --</option>
            {[...Array(100)].map((_, index) => (
            <option key={index} value={index + 1}>
                {index + 1}
            </option>
            ))}
  </select>
</label>


      <label>
        Description:
        <input type="text" name="description" value={listing.description} onChange={handleChange} />
      </label>

        <div >
            <input style={{height: 40}} type="file" id="image" name="image" onChange={(e) => setImage(e.target.files[0])}/>
        </div>

      <button type="submit" className="button1">Create Listing</button>
    </form>
    <br/>
            </div>
        </div>
    </div>
  );
}

export default SellerCreateListing;
