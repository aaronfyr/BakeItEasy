import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import "./resources/sellerViewFollowers.css";
import SellerOrderCard from "./sellerFollowerCard.js";

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
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/followers`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
    });
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
      <SellerNavigationBar />
      <div className="dropdownRow">
        <div className="heading"></div>
      </div>
      <div className="searchBarSection">
        <div class="searchBar">
          <input
            className="input"
            onChange={(e) => {
              setSearch(e.target.value.toLowerCase());
            }}
          />
        </div>
        <div className="flex">
          <div style={{ width: 200 }}>
            <div style={{ height: 40 }}></div>
            <h1>My Followers</h1>
          </div>
          <div className="orderDisplay">
            {filteredFollowers.map((follower) => (
              <div className="listingComponent">
                <SellerOrderCard>
                  <div className="sellerOrderCardHeader"></div>
                  <div className="sellerOrderCardBodyFlex">
                    <div className="sellerOrderCardBodyFlex"></div>

                    <div style={{ width: 400 }} className="cardTextBlock">
                      <div className="flex">
                        <div
                          style={{
                            height: "35px",
                            width: "35px",
                            borderRadius: "50%",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: "100%",
                              backgroundImage: `url(${follower.imagePath})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          ></div>
                        </div>
                        <div style={{ width: 10 }}></div>
                        <h2>@{follower.username}</h2>
                      </div>
                      <div className="flexBox"></div>
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
}

const pfpStyle = {
  padding: 0.5,
  borderRadius: "50%",
  width: 30,
  height: 30,
  objectFit: "cover",
  background: "grey",
  display: "block",
};

const imgStyle = {
  height: 150,
  width: 150,
  objectFit: "cover",
  borderRadius: 10,
};

export default SellerViewFollowers;
