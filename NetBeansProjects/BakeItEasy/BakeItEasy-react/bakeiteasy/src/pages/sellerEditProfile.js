import { Flex, Button } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SellerNavigationBar } from "../components/sellerNavigationBar";
import "./resources/default.css";
import "./resources/sellerViewOrder.css";

function SellerEditProfile() {
  const { id } = useParams();
  const [seller, setSeller] = useState([]);
  const [sellerId, setSellerId] = useState(null);
  const [sellerObj, setSellerObj] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [sendUpdate, setSendUpdate] = useState(false);

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
        navigate("/login?type=seller");
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

  //fetch seller
  console.log("sellerID is", sellerId);
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => setSellerObj(data));
  }, [sellerId]);

  const handleGoBack = () => {
    window.history.back();
  };

  const fileUpload = (newFile) => {

  // Only upload image if it's not empty
    const data = new FormData();
    data.append("file", newFile);
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
            toast.error("failed to upload image, try again")
          // handle error
        }
      })
      .then((data) => {
        console.log("cloud url is", data.url);

        setSellerObj((prevListing) => ({
          ...prevListing,
          imagePath: data.url,
        }));
        console.log("imagePath after setting is", sellerObj.imagePath);
        console.log(sellerObj);
        // Call second fetch after the first one finishes

      });
  };

  //edit seller
 const handleUpdate = () => {
    setIsEditable(false);

    fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sellerObj),
          }
        )
          .then((response) => {
            if (!response.ok) {
              toast.error("Failed to update profile. Refreshing...");

              setTimeout(() => {
                    window.location.reload();
                }, 4000);
              throw new Error("Failed to update seller");
            } else {
              console.log("ok response");

              toast.success("Profile updated successfully.");
            }
            return response.json();
          })
          .then(() => {
            // handle successful update
            console.log("pretoast");
            window.location.reload();
          })
          .catch((error) => {
            /*handle error */
          });

}
;



  return (
    <div>
      <SellerNavigationBar />
      <br />
      <ToastContainer />
      <div style={{ width: 220 }}>
        <div className="button1" onClick={handleGoBack}>
          <FaArrowLeft />
          Back to profile
        </div>
      </div>
      <br />
      <div className="parent">
        <div className="rightListingContainer">
          <h1 style={{ textAlign:"center" }}>
            Edit My Profile
          </h1>
          <br/>
          <div style={{width:200, display: "block", margin: "auto", justifySelf:"center"}}>
            <img style={{borderRadius: '50%', objectFit: 'cover', width: '200px', height: '200px'}}
          src={sellerObj.imagePath ? sellerObj.imagePath : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="pfp"/></div>
            <br/>

          <div style={{width:400, margin:0}}>
            <h3 className="listingH3">Name:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={sellerObj.name}
              onChange={(e) =>
                setSellerObj({ ...sellerObj, name: e.target.value })
              }
            />
          ) : (
            <h2 className="listingH2">{sellerObj.name}</h2>
          )}
          <h3 className="listingH3">Username:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={sellerObj.username}
              onChange={(e) =>
                setSellerObj({ ...sellerObj, username: e.target.value })
              }
            />
          ) : (
            <h2 className="listingH2">{sellerObj.username}</h2>
          )}
          <h3 className="listingH3">Phone:</h3>
          {isEditable ? (
            <input
              type="text"
              className="inputStyle"
              value={sellerObj.phoneNo}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
                setSellerObj({ ...sellerObj, phoneNo: e.target.value });
              }}
            />
          ) : (
            <h2 className="listingH2">{sellerObj.phoneNo}</h2>
          )}
           {isEditable && (
            <div>
                <input
                style={{ height: 40, width:400 }}
                type="file"
                id="image"
                name="image"
                accept=".jpeg, .png, .jpg"
                onChange={(e) => fileUpload(e.target.files[0])}
                />
            </div>
            )}
          <div style={{ height: 10 }}></div>
          <Flex>
            {!isEditable &&

              <Button bg="#E2725B" colorScheme="white" onClick={() => setIsEditable(true)}  w="100%">
                Edit
              </Button>

            }
            {isEditable && (
                <Button bg="#E2725B" colorScheme="white" onClick={() => handleUpdate()}  w="100%">
                Done
              </Button>
            )}
          </Flex>
          <div style={{ height: 10 }}></div>
          <h3 className="listingH3">Email:</h3>
          <h2 className="listingH2">{sellerObj.email}</h2>
          </div>


          <br></br>
        </div>
      </div>
    </div>
  );
}

export default SellerEditProfile;
