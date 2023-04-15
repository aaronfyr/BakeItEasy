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
  FormControl,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";
import Popup from "reactjs-popup";
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
import { formatDate } from "./formatter.js";

const Comment = ({ commentId, currentTitle, dateCreated, isBuyer }) => {
  const navigate = useNavigate();
  const dateToday = new Date();

  if (!dateCreated) {
    dateCreated = "-";
  }

  // fetch commenter
  const [commenter, setCommenter] = useState();
  const [commenterId, setCommenterId] = useState();
  const [commenterName, setCommenterName] = useState();
  const [commenterUsername, setCommenterUsername] = useState();
  const [commenterProfilePhoto, setCommenterProfilePhoto] = useState();
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
        setCommenterProfilePhoto(data.imagePath);
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

  //edit buyer
  const [commentObj, setCommentObj] = useState([]);
  const [title, setTitle] = useState([]);
  const handleEdit = async (event) => {
    event.preventDefault();
    console.log("handleUpdate: ", "in");
    console.log("newTitle: ", title);
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, dateToday, isBuyer }),
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error);
    } else {
      window.location.reload();
      toast.success("Comment updated successfully.");
    }
  };

  return (
    <>
      <div className="commentCard">
        <SellerOrderCard>
          <div className="sellerOrderCardHeader"></div>
          <div className="commentBodyFlex">
            <div style={{ width: "97%" }} className="commentTextBlock">
              {isBuyer && (
                <HStack spacing="15px">
                  <div className="homepageProfilePhoto">
                    <img
                      className="homepageProfilePhotoImg"
                      src={
                        commenterProfilePhoto
                          ? commenterProfilePhoto
                          : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                      }
                      alt="baked listing"
                    />
                  </div>
                  <div className="postBuyerHeader">{commenterUsername}</div>
                </HStack>
              )}
              {!isBuyer && (
                <HStack>
                  <HStack spacing="15px">
                    <div className="homepageProfilePhoto">
                      <img
                        className="homepageProfilePhotoImg"
                        src={
                          commenterProfilePhoto
                            ? commenterProfilePhoto
                            : "https://www.homemadeinterest.com/wp-content/uploads/2021/10/Easy-Chocolate-Croissant_IG-3.jpg"
                        }
                        alt="baked listing"
                      />
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
              <h3>{currentTitle}</h3>
              <div className="commentFooter">
                <HStack>
                  <div>posted on: {formatDate(dateCreated)}</div>
                </HStack>
                <Spacer />
                {((!isBuyer && commenterId === sellerId) ||
                  (isBuyer && commenterId === buyerId)) && (
                  <Popup trigger={<FiEdit3 size="1.2rem" />} modal nested>
                    {(close) => (
                      <div className="modal">
                        <button className="close" onClick={close}>
                          &times;
                        </button>
                        <div className="header"> Edit Comment </div>
                        <div className="content">
                          <form onSubmit={(event) => handleEdit(event)}>
                            <FormControl mt={4}>
                              <FormLabel>Comment: </FormLabel>
                              <Input
                                type="text"
                                placeholder=" "
                                value={title}
                                onChange={(event) => {
                                  console.log("onChange: ", event.target.value);
                                  setTitle(event.target.value);
                                }}
                                required
                              />
                            </FormControl>

                            <Box mt={4} display="flex" alignItems="center">
                              <Button
                                bg="#E2725B"
                                colorScheme="white"
                                type="submit"
                                w="100%"
                              >
                                Done
                              </Button>
                            </Box>
                          </form>
                        </div>
                      </div>
                    )}
                  </Popup>
                )}
              </div>
            </div>
          </div>
        </SellerOrderCard>
      </div>
    </>
  );
};

export default Comment;
