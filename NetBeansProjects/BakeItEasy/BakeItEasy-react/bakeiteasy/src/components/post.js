import { React, useEffect, useState } from "react";
import Aos from "aos";
import { toast, ToastContainer } from "react-toastify";
import { formatDate } from "./formatter";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { FiUserPlus, FiUserMinus, FiMessageSquare } from "react-icons/fi";

const Post = ({ postId, title, dateCreated, postCategory, isBuyer, categoryImage }) => {
  const navigate = useNavigate();

  console.log("in post:", postId);

  // fetch poster
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState();
  const [userUsername, setUserUsername] = useState();
  const [userProfilePhoto, setUserProfilePhoto] = useState();
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/posts/${postId}/${
        isBuyer ? "buyer" : "seller"
      }`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log("post user: ", data);
        setUser(data);
        if (isBuyer) {
          setUserId(data.buyerId);
        } else {
          setUserId(data.sellerId);
        }
        setUserName(data.name);
        setUserUsername(data.username);
        setUserProfilePhoto(data.imagePath);
      });
  }, []);

  /* FOLLOWING FUNCTIONS */
  // fetch current viewer if it's a buyer, then fetch its following
  const [buyer, setBuyer] = useState();
  const [buyerId, setBuyerId] = useState();
  const [sellerId, setSellerId] = useState(null);
  const [isCurrentUserABuyer, setIsCurrentUserABuyer] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const fetchedSeller = localStorage.getItem("seller");
      const fetchedBuyer = localStorage.getItem("buyer");

      if (!fetchedBuyer && !fetchedSeller) {
        navigate("/login");
      }
      if (!fetchedSeller) {
        setIsCurrentUserABuyer(true);
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          setBuyerId(parsedUser.buyerId);
          /*if (parsedUser.buyerId === commenterId) {
            setIsCurrentUserComment(true);
          }*/
        } catch (error) {
          console.log(error);
        }
      } else {
        setIsCurrentUserABuyer(false);
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSellerId(parsedUser.sellerId);
          /*if (parsedUser.sellerId === commenterId) {
            setIsCurrentUserComment(true);
          }*/
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // fetch current buyer followings
  const [followings, setFollowings] = useState();
  const [isFollowing, setIsFollowing] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        let buyerId = null;
        const fetchedBuyer = localStorage.getItem("buyer");
        if (!fetchedBuyer) {
        } else {
          const parsedUser = JSON.parse(fetchedBuyer);
          buyerId = parsedUser.buyerId;

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
          setFollowings(data);
          //console.log("sellerProfile, followings: ", followings);
          const checkIsFollowing = data.some(
            (val) => val.sellerId.toString() === userId
          );

          setIsFollowing(checkIsFollowing);
          //console.log("sellerProfile, isFollowing: ", isFollowing);
          console.log(`HTTP Response Code: ${response?.status}`);
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        }
      }
    };
    fetchData();
  }, []);

  // handleFollowSeller
  const handleFollowSeller = async (sId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sId}/${buyerId}/follow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsFollowing(true);
      toast.success(`Followed Seller!`);
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  // handleUnfollowSeller
  const handleUnfollowSeller = async (sId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sId}/${buyerId}/unfollow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsFollowing(false);
      console.log("unfollowed SellerId# ", sId);

      toast.success(`Unfollowed Seller.`);
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  // routeChangeToPost
  const routeChangeToPost = (postId) => {
    console.log("routechangetopost: ", postId);
    let path = "/forum/post/";
    navigate(path + postId);
  };

  // routeChangeToSellerProfile
  const routeChangeToSellerProfile = (sId) => {
    if (!isBuyer && sId) {
      let path = "/buyerViewSellerProfile/" + sId;
      navigate(path);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div data-aos="fade-left" className="postCard">
      <div className="postCardContentGrid">
        <div
          className="postCardContentGrid_left"
          onClick={() => routeChangeToPost(postId)}
        >
          <img
            className="homepageProfilePhotoImg2"
            src={categoryImage ? categoryImage
                        : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                    }
            alt="baked listing"
          />
        </div>

        <div className="postCardContentGrid_right">
          <div className="postCardHeader">
            {isBuyer && (
              <HStack>
                <div className="homepageProfilePhoto">
                  <img
                    className="homepageProfilePhotoImg"
                    src={
                      userProfilePhoto
                        ? userProfilePhoto
                        : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                    }
                    alt="baked listing"
                  />
                </div>
                <div className="postBuyerHeader">{userUsername}</div>
              </HStack>
            )}
            {!isBuyer && (
              <HStack>
                <HStack>
                  <div className="homepageProfilePhoto">
                    <img
                      className="homepageProfilePhotoImg"
                      src={
                        userProfilePhoto
                          ? userProfilePhoto
                          : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                      }
                      alt="baked listing"
                    />
                  </div>
                  <div
                    className="postSellerHeader"
                    onClick={() => routeChangeToSellerProfile(userId)}
                  >
                    {userUsername}
                  </div>
                </HStack>
                <Spacer />

                {isCurrentUserABuyer && !isFollowing && (
                  <div className="postSellerHeader">
                    <FiUserPlus
                      size="1.2rem"
                      onClick={() => handleFollowSeller(userId)}
                    />
                  </div>
                )}
                {isCurrentUserABuyer && isFollowing && (
                  <div className="postSellerHeader">
                    <FiUserMinus
                      size="1.2rem"
                      onClick={() => handleUnfollowSeller(userId)}
                    />
                  </div>
                )}
              </HStack>
            )}
          </div>
          <div
            className="postCardDetails"
            onClick={() => routeChangeToPost(postId)}
          >
            <h1>{title}</h1>
            <h4 className="details">{formatDate(dateCreated)}</h4>
            <h4 className="details">#{postCategory}</h4>
          </div>
          <div
            className="postCardFooter"
            onClick={() => routeChangeToPost(postId)}
          >
            <div className="postFooterContent">
              <HStack>
                <FiMessageSquare size="1.2rem" />
                <div>View Comments</div>
              </HStack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
