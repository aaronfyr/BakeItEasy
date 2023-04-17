import { Flex, Button } from "@chakra-ui/react";
import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import "./resources/default.css";
import "./resources/listing.css";
import { FaArrowLeft } from "react-icons/fa";
import { HStack } from "@chakra-ui/react";

import { NavigationBar } from "../components/buyerNavigationBar";

function SellerChangePassword() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState([]);
  const [isEditable, setIsEditable] = useState(true);
  const [seller, setSeller] = useState([]);
  const [sellerId, setSellerId] = useState(0);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [cfmPw, setCfmPw] = useState("");

  let navigate = useNavigate();


  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      /*if (!fetchedBuyer) {
        console.log("navbar", "no buyer");
        navigate("/login");
      } else {*/
      if (!fetchedSeller) {
        console.log("sellerProfile", "no seller");
        navigate("/login?type=seller");
      } else {
        console.log("sellerProfile", "has seller");
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSeller(parsedUser);
          setSellerId(parsedUser.sellerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);



  //edit seller
 const handleChangePassword = async () => {
  setIsEditable(false);

  console.log("seller ID is", sellerId);
    console.log("seller current password entered is", currentPw);
    console.log("seller NEW pw", newPw);
    console.log("seller CFM pw", cfmPw)


  try {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/changePassword?currentPassword=${currentPw}&newPassword=${newPw}&confirmPassword=${cfmPw}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error);
      toast.loading("refreshing...");

      setTimeout(() => {
        window.location.reload();
      }, 2500);
      throw new Error("Failed to change password");
    } else {
      toast.success("Password updated successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    console.log("pretoast");
  } catch (error) {
    /*handle error */
  }
};


  return (
    <div>
      <SellerNavigationBar />
      <br />
      <ToastContainer />

      <div style={{ display: "flex" }}>

        <div style={{ width: 400, height: 300 }}>
            <div className="button1" style={{width:250}}onClick={() => (window.history.back())}>
          <FaArrowLeft />
          <HStack width={3}/>
          Back to edit profile
        </div>
        </div>

        <div id="rightListingContainer" style={{marginLeft: 100}}>
          <h1>Change password</h1>
            <br/>
        <h3 className="listingH4">Current password:</h3>
             <input
              type="password"
              className="inputStyle"
              onChange={(e) => setCurrentPw(e.target.value)}
            />

          <h3 className="listingH4">New password:</h3>

            <input
              type="password"
              className="inputStyle"
              onChange={(e) => setNewPw(e.target.value)}
            />

          <h3 className="listingH4">Confirm password:</h3>
             <input
              type="password"
              className="inputStyle"
              onChange={(e) => setCfmPw(e.target.value)}
            />



          <div style={{ height: 10 }}></div>
          <Flex>
                <Button bg="#E2725B" colorScheme="white" isDisabled={!isEditable} onClick={handleChangePassword}  w="400px">
                Confirm
              </Button>
          </Flex>
          <div style={{ height: 10 }}></div>

          <div style={{ height: 10 }}></div>
          <br></br>
        </div>
      </div>
    </div>
  );
}

export default SellerChangePassword;

/*
<div class="slideshow-container">
            <div class="mySlides fade">
              <div class="numbertext">1 / 3</div>
              <img src={require("../assets/teracotta.jpg")} alt="dummyimage" />
              <div class="text">Caption Text</div>
            </div>
            <div class="mySlides fade">
              <div class="numbertext">2 / 3</div>
              <img src={require("../assets/auburn.png")} alt="dummyimage" />
              <div class="text">Caption Two</div>
            </div>
            <div class="mySlides fade">
              <div class="numbertext">3 / 3</div>
              <img src={require("../assets/cardinal.png")} alt="dummyimage" />
              <div class="text">Caption Three</div>
            </div>
            <div class="prev" onClick={() => plusSlides(-1)}>
              &#10094;
            </div>
            <div class="next" onClick={() => plusSlides(1)}>
              &#10095;
            </div>
          </div>
          <br />
          <div>
            <span class="dot" onClick={() => currentSlide(1)}></span>
            <span class="dot" onClick={() => currentSlide(2)}></span>
            <span class="dot" onClick={() => currentSlide(3)}></span>
          </div>
        </div>
        */
