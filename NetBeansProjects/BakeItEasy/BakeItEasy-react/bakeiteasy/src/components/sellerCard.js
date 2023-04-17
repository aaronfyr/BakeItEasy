import { React, useEffect, useState } from "react";
import Aos from "aos";
import { toast, ToastContainer } from "react-toastify";
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

const Seller = ({ sellerId, name, username, profilePhoto }) => {
  const navigate = useNavigate();

  /* FOLLOWING FUNCTIONS */
  // fetch current viewer if it's a buyer, then fetch its following
  // fetch buyer
  const [buyer, setBuyer] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const buyer = localStorage.getItem("buyer");
      if (!buyer) {
        console.log("homepage: ", "has no buyer");
        navigate("/login");
      } else {
        console.log("homepage: ", "has buyer");
        const parsedUser = JSON.parse(buyer);
        setBuyer(parsedUser);
        setBuyerId(parsedUser.buyerId);
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
            (val) => val.sellerId === sellerId
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
  const handleFollowSeller = async () => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/${buyerId}/follow`,
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
  const handleUnfollowSeller = async () => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/sellers/${sellerId}/${buyerId}/unfollow`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      setIsFollowing(false);
      console.log("unfollowed SellerId# ", sellerId);
      toast.success(`Unfollowed Seller.`);
    } else {
      // show error message
      const errorData = await response.json();
      toast.error(errorData.error);
    }
  };

  // routeChangeToSellerProfile
  const routeChangeToSellerProfile = () => {
    let path = "/buyerViewSellerProfile/" + sellerId;
    navigate(path);
  };

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <div data-aos="fade-left" className="sellerCard">
      <div className="sellerCardContentGrid">
        <div className="sellerCardContentGrid_left">
          <img
            className="homepageProfilePhotoImg"
            alt="seller pfp"
            src={profilePhoto}
          ></img>
        </div>

        <div className="sellerCardContentGrid_right">
          <div className="sellerCardHeader">
            <h1 className="seller" onClick={() => routeChangeToSellerProfile()}>
              @{username}
            </h1>
          </div>
          <div className="sellerCardDetails">
            <div className="postFooterContent">
              {!isFollowing && (
                <div className="postSellerHeader">
                  <Flex>
                    <div
                      className="button1_follow"
                      onClick={() => handleFollowSeller()}
                    >
                      <HStack>
                        <FiUserPlus size="1.2rem" />
                        <div>Follow</div>
                      </HStack>
                    </div>
                  </Flex>
                </div>
              )}
              {isFollowing && (
                <div className="postSellerHeader">
                  <Flex>
                    <div
                      className="button1_follow"
                      onClick={() => handleUnfollowSeller()}
                    >
                      <HStack>
                        <FiUserMinus size="1.2rem" />
                        <div>Unfollow</div>
                      </HStack>
                    </div>
                  </Flex>
                </div>
              )}
            </div>
          </div>
          <div className="postCardFooter"></div>
        </div>
      </div>
    </div>
  );
};

export default Seller;
