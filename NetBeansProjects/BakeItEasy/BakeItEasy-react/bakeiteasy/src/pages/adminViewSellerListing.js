import { Flex } from "@chakra-ui/react";
import { React, useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminMenuBar from "../components/adminMenuBar";
import { formatPrice } from "../components/formatter";
import { Slideshow } from "../components/slideshow";
import "./resources/default.css";
import "./resources/listing.css";

function AdminViewSellerListing() {
  console.log("test");
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [likeNum, setLikeNum] = useState(404);
  const [listingImagePaths, setListingImagePaths] = useState([""]);

 /*  let navigate = useNavigate(); */
 /*  const routeChangeToSellerProfile = () => {
    let path = "/adminViewSellerProfile?id=" + id;
    navigate(path);
  }; */

  //fetch listing deets
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/listings/${id}`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setListing(data);
        setLoading(false);
        setListingImagePaths(data.imagePaths);
        console.log("response is", data);
      } catch (error) {
        console.log("ERROR !!!!!" + error);
      }
    }
    fetchData();
  }, []);

  //fetch listing likes
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${id}/likes`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setLikeNum(data);
        setLoading(false);
      })
      .catch((error) => console.log("ERROR !!!!!" + error));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdminMenuBar />
      <br />
      <ToastContainer />
      <h1>Listing: {listing.name} </h1>
      <div id="listingContainer">
        <div class="leftListingContainer">
          <Slideshow imagePaths={listingImagePaths} />

          <Flex justifyContent={"space-between"}></Flex>
          <br />
          <br />
          <div id="listingDetailsGrid"></div>
          <br />
        </div>
        <div id="rightListingContainer">
          <h3 className="listingH3">Price:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={listing.price}
              onChange={(e) =>
                setListing({ ...listing, price: e.target.value })
              }
            />
          ) : (
            <h2 className="listingH2">${formatPrice(listing.price)}</h2>
          )}
          <h3 className="listingH3">Name:</h3>
          {isEditable ? (
            <input
              type="text"
              className="listingLabel"
              value={listing.name}
              onChange={(e) => setListing({ ...listing, name: e.target.value })}
            />
          ) : (
            <h2 className="listingH2">{listing.name}</h2>
          )}
          <h3 className="listingH3">Description:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={listing.description}
              onChange={(e) =>
                setListing({ ...listing, description: e.target.value })
              }
            />
          ) : (
            <h2 className="listingH2">{listing.description}</h2>
          )}

          <div>
            <h3 className="listingH3">Minimum Preparation Days:</h3>
            {isEditable ? (
              <select
                value={listing.minPrepDays}
                onChange={(e) =>
                  setListing({
                    ...listing,
                    minPrepDays: parseInt(e.target.value),
                  })
                }
              >
                <option value="0">0 days</option>
                <option value="1">1 day</option>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
                <option value="5">5 days</option>
                <option value="6">6 days</option>
                <option value="7">7 days</option>
                <option value="8">8 days</option>
                <option value="9">9 days</option>
                <option value="10">10 days</option>
              </select>
            ) : (
              <h2 className="listingH2">{listing.minPrepDays} day(s)</h2>
            )}
          </div>
          <div>
            <h3 className="listingH3">Maximum Quantity:</h3>
            {isEditable ? (
              <select
                value={listing.maxQuantity}
                onChange={(e) =>
                  setListing({
                    ...listing,
                    maxQuantity: parseInt(e.target.value),
                  })
                }
              >
                {[...Array(200).keys()].map((num) => (
                  <option value={num + 1}>{num + 1}</option>
                ))}
              </select>
            ) : (
              <h2 className="listingH2">{listing.maxQuantity}</h2>
            )}
          </div>
          <Flex>
            <FiHeart
              style={{
                alignSelf: "center",
                marginTop: 5,
                marginRight: 10,
                fontSize: 20,
              }}
            >
              {" "}
            </FiHeart>{" "}
            <h3 style={{ fontSize: 20 }}>{likeNum}</h3>
          </Flex>
          <div style={{ height: 10 }}></div>
          <h3 className="listingH3">Category:</h3>
          <h2 className="listingH2">
            {listing.listingCategory
              ? listing.listingCategory.toLowerCase()
              : ""}
          </h2>

          <br></br>
        </div>
      </div>
    </div>
  );
}

export default AdminViewSellerListing;
