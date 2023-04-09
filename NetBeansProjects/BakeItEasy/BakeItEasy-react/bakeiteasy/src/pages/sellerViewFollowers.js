import { color } from "framer-motion";
import React, {useState, useEffect } from "react";
import "./resources/sellerViewFollowers.css";
import SellerOrderCard from "./sellerFollowerCard.js";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import {FaListUl} from "react-icons/fa";
import {
  BrowserRouter as Router,
  useNavigate,
  useParams,
} from "react-router-dom";


/*const orderResponse = await fetch(``)*/

function SellerViewFollowers() {
  const [search, setSearch] = useState("");
  const [followers, setFollowers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
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
        navigate("/login");
      } else {
        console.log("sellerProfile", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          //setSeller(parsedUser);
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

  //get followers
/*async function    fetchFollowers() {
  try {
    const response = await fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/followers`, {
      //get seller id from storage !!!!!!!!!!!!!!
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setFollowers(data);
  } catch (error) {
    console.error(error);
  }
}*/

async function fetchFollowers(sellerId) {
  if (sellerId) {
    console.log("sellerId", sellerId);
    try {
      const response = await fetch(`http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/followers`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setFollowers(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
}




function filterFollowers(followers, search) {
  return followers.filter((follower) => {
   return (
        follower.name.toLowerCase().includes(search) ||
        follower.username.toLowerCase().includes(search)
      );
    }
  );
}

useEffect(() => {
    fetchFollowers(sellerId);
}, [sellerId]);

useEffect(() => {
    fetchFollowers(sellerId);
  if (followers.length > 0) {
    const filteredData = filterFollowers(followers, search);
    setFilteredFollowers(filteredData);
  }
}, [followers, search]);

   let navigate = useNavigate();

  return (
    <div>
        <SellerNavigationBar/>
        <div className="dropdownRow">
            <div className="heading">

            </div>

        </div>
        <div className="searchBarSection">
            <div class="searchBar">
                <input
                className="input"
                onChange={(e) => {
                    setSearch(e.target.value.toLowerCase());
                }}
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                </svg>
                </button>
            </div>
            <div className="flex">
                <div style={{width:200}}>
                    <div style={{height:40}}></div>
                    <h1>My Followers</h1>
                </div>
                <div className="orderDisplay">
                    {filteredFollowers.map((follower) => (
                    <div className="listingComponent">
                        <SellerOrderCard>
                        <div className="sellerOrderCardHeader">
                        </div>
                        <div className="sellerOrderCardBodyFlex">
                            <div className="sellerOrderCardBodyFlex">

                            </div>

                            <div style={{width: 400}} className="cardTextBlock">
                                <div className="flex">
                                    <div style={{
                                        height: '35px',
                                        width: '35px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        }}>
                                        <div style={{
                                            height: '100%',
                                            width: '100%',
                                            backgroundImage: `url('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}></div>
                                        </div>
                                        <div style={{width: 10}}></div>
                                    <h2>{follower.name}  (@{follower.username})</h2>
                                </div>
                                <h4>{follower.email}</h4>
                                <div className="flexBox">
                                </div>
                            </div>
                        </div>
                    </SellerOrderCard>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};


const pfpStyle = {padding: 0.5, borderRadius: "50%", width: 30, height: 30,
                    objectFit: "cover", background: "grey", display:"block" }

const imgStyle = {height: 150, width: 150, objectFit:"cover", borderRadius: 10}



export default SellerViewFollowers;
