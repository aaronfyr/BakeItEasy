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
import SellerOrderCard from "../pages/sellerFollowerCard.js";
import {
  FiUserPlus,
  FiUserMinus,
  FiMessageSquare,
  FiEdit3,
} from "react-icons/fi";

const Comment = ({ commentId, title, dateCreated, isBuyer }) => {
  const navigate = useNavigate();

  // fetch commenter
  const [commenter, setCommenter] = useState();
  const [commenterId, setCommenterId] = useState();
  const [commenterName, setCommenterName] = useState();
  const [commenterUsername, setCommenterUsername] = useState();
  useEffect(() => {
    fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/comments/${commentId}/${
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
        console.log("commenter: ", data);
        setCommenter(data);
        if (isBuyer) {
          setCommenterId(data.buyerId);
        } else {
          setCommenterId(data.sellerId);
        }
        setCommenterName(data.name);
        setCommenterUsername(data.username);
      });
  }, []);

  /* FOLLOWING FUNCTIONS */
  console.log("isCommentByABuyer:", isBuyer);
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
        // current viewer is a buyer
        setIsCurrentUserABuyer(true);
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          setBuyerId(parsedUser.buyerId);
        } catch (error) {
          console.log(error);
        }
      } else {
        // current viewer is a seller
        setIsCurrentUserABuyer(false);
        try {
          const parsedUser = JSON.parse(fetchedSeller);
          setSellerId(parsedUser.sellerId);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // fetch current buyer followings
  const [followings, setFollowings] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let buyerId = null;
        const fetchedBuyer = localStorage.getItem("buyer");
        if (!fetchedBuyer) {
        } else {
          const parsedUser = JSON.parse(fetchedBuyer);
          buyerId = parsedUser.buyerId;
        }

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
        const checkIsFollowing = data.some(
          (val) => val.sellerId.toString() === commenterId
        );

        setIsFollowing(checkIsFollowing);
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

  return (
    <div className="commentCard">
      <SellerOrderCard>
        <div className="sellerOrderCardHeader"></div>
        <div className="commentBodyFlex">
          <div style={{ width: "97%" }} className="commentTextBlock">
            {isBuyer && (
              <HStack spacing="15px">
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
                      backgroundImage: `url('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
                <div className="postBuyerHeader">{commenterUsername}</div>
              </HStack>
            )}
            {!isBuyer && (
              <HStack>
                <HStack spacing="15px">
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
                        backgroundImage: `url('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  </div>
                  <div className="postSellerHeader">{commenterUsername}</div>
                </HStack>
                <Spacer />
                {isCurrentUserABuyer && !isFollowing && (
                  <div className="postSellerHeader">
                    <FiUserPlus
                      size="1.2rem"
                      onClick={() => handleFollowSeller(commenterId)}
                    />
                  </div>
                )}
                {isCurrentUserABuyer && isFollowing && (
                  <div className="postSellerHeader">
                    <FiUserMinus
                      size="1.2rem"
                      onClick={() => handleUnfollowSeller(commenterId)}
                    />
                  </div>
                )}
              </HStack>
            )}
            <h3>{title}</h3>
            <div className="commentFooter">
              <HStack>
                <div>posted on: {dateCreated}</div>
              </HStack>
              <Spacer />
              {isBuyer && commenterId === buyerId && (
                <FiEdit3
                  size="1.2rem"
                  onClick={() => handleFollowSeller(commenterId)}
                />
              )}
              {!isBuyer && commenterId === sellerId && (
                <FiEdit3
                  size="1.2rem"
                  onClick={() => handleFollowSeller(commenterId)}
                />
              )}
            </div>
          </div>
        </div>
      </SellerOrderCard>
    </div>
  );
};

export default Comment;
