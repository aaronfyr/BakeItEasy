import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  useDisclosure,
  useNumberInput,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { FaHeart, FaPhone } from "react-icons/fa";

import "react-datepicker/dist/react-datepicker.css";
import "./resources/default.css";
import "./resources/listing.css";

import { NavigationBar } from "../components/buyerNavigationBar";
import { formatDate, formatPrice } from "../components/formatter";
import { ListingSellerHeader } from "../components/listingSellerHeader";
import { Slideshow } from "../components/slideshow";

function BuyerListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // get Buyer info
  const [buyer, setBuyer] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const [address, setAddress] = useState("");
  useEffect(() => {
    async function fetchData() {
      const fetchedBuyer = localStorage.getItem("buyer");
      if (!fetchedBuyer) {
        console.log("navbar", "no buyer");
        navigate("/login");
      } else {
        console.log("navbar", "has buyer");
        try {
          const parsedUser = JSON.parse(fetchedBuyer);
          setBuyer(parsedUser);
          setBuyerId(parsedUser.buyerId);
          setAddress(parsedUser.address);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, []);

  // get Listing info
  const [listing, setListing] = useState(null);
  const [listingId, setListingId] = useState(null);
  const [listingName, setListingName] = useState(null);
  const [listingDescription, setListingDescription] = useState(null);
  const [price, setPrice] = useState(null);
  const [listingMaxQty, setListingMaxQty] = useState(null);
  const [listingImagePaths, setListingImagePaths] = useState([""]);
  const [listingMinPrep, setListingMinPrep] = useState(0);
  const [listingDate, setListingDate] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
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
        //console.log("fetched data: ", data);
        setListing(data);
        setListingId(data.listingId);
        setListingName(data.name);
        setListingDescription(data.description);
        setPrice(data.price);
        setListingMaxQty(data.maxQuantity);
        setListingImagePaths(data.imagePaths);
        setListingMinPrep(data.minPrepDays);
        setListingDate(data.dateOfCreation);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        } else {
          console.log("Other error: ", error);
        }
      }
    };
    fetchData();
  }, []);

  //console.log(listing);

  const [whatsappUrl, setWhatsappUrl] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/BakeItEasy-war/webresources/listings/${id}/sellerPhoneNo`,
          {
            method: "GET",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setWhatsappUrl("https://wa.me/65" + data);
        console.log(whatsappUrl);
        console.log(`HTTP Response Code: ${response?.status}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          // Unexpected token < in JSON
          console.log("There was a SyntaxError", error);
        } else {
          console.log("Other error: ", error);
        }
      }
    };
    fetchData();
  }, []);

  // quantity input
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: listingMaxQty,
      onChange: (val) => {
        setQuantity(val);
        console.log("quantitychange: ", quantity);
      },
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  var someDate = new Date();
  const datePickerMinDate = new Date(
    someDate.setDate(someDate.getDate() + listingMinPrep)
  );

  // successful create order
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(5px) hue-rotate(-10deg)"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

  // FUNCTIONS
  // handle submit order
  const dateOfCreation = new Date();
  const [quantity, setQuantity] = useState(1);
  const [dateOfCollection, setDateOfCollection] = useState(null);
  const [description, setDescription] = useState("-");
  const [orderFieldValues, addOrderFieldValue] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmitOrder = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/orders/${buyerId}/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          quantity,
          description,
          address,
          dateOfCreation,
          dateOfCollection,
        }),
      }
    );

    if (response.ok) {
      // redirect to homepage
      setOverlay(<OverlayOne />);
      onOpen();
    } else {
      // show error message
      setError("Invalid details. Please try again.");
    }
  };

  // routeChangeToHomepage
  const routeChangeToHomepage = () => {
    console.log("routechangetohomepage: ");

    navigate("/");
  };

  const handleListingToLikes = async (lId) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/listings/${lId}/${buyer.buyerId}/like`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      // redirect to homepage
      console.log("likedListing# ", lId);
      console.log("reported seller!");
      toast.success(`Liked listing!`);
      //recolor liked button
      document.getElementById("btn").style.backgroundColor = "black";
    } else {
      // show error message
      const errorData = await response.json();
      toast.error("Like failed.");
    }
  };

  // for slideshow
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
  ]);

  console.log("dateofcreation", listingDate);

  return (
    <div>
      <NavigationBar />
      <ToastContainer />
      <br />
      <div id="listingContainer">
        <div id="buyerLeftListingContainer">
          <Slideshow imagePaths={listingImagePaths} />
          <Flex justifyContent={"space-between"}>
            <Flex>
              <div
                className="button1_cancel"
                onClick={() => handleListingToLikes(id)}
              >
                <HStack spacing="10px">
                  <FaHeart />
                  <div>Like</div>
                </HStack>
              </div>
              <a
                className="button1_cancel"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <HStack spacing="10px">
                  <div>Whatsapp</div>
                  <FaPhone />
                </HStack>
              </a>
            </Flex>
            <div></div>
          </Flex>
          <br />
          <h5>
            {" "}
            <ListingSellerHeader lId={listingId} />
          </h5>
          <h1>{listingName}</h1>
          <h5>Date posted: {formatDate(listingDate)} </h5>
          <br />
          <div id="buyerListingDetailsGrid">
            <h3>Price</h3>
            <h3>${formatPrice(price)}</h3>
            <h3>Maximum Quantity Per Order:</h3>
            <h3>{listingMaxQty}</h3>
            <h3>Minimum Preparation time:</h3>
            <h3>{listingMinPrep} days</h3>
            <h3>Description:</h3>
            <h3> {listingDescription}</h3>
          </div>
          <br />
        </div>
        <div id="rightListingContainer">
          <form onSubmit={handleSubmitOrder}>
            <FormControl mt={4} variant="floating">
              <Input
                type="text"
                placeholder=" "
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
              <FormLabel>Customisation Notes</FormLabel>
            </FormControl>

            <FormControl mt={4} variant="floating">
              <Select
                placeholder="Select Variant"
                onChange={(event) => addOrderFieldValue(event.target.value)}
              >
                <option>Red</option>
                <option>Orange</option>
                <option>Yellow</option>
                <option>Blue (Limited)</option>
              </Select>
              <FormLabel>Variation</FormLabel>
            </FormControl>

            <FormControl mt={4} variant="floating">
              <Select
                placeholder="Select Decoration Colour"
                onChange={(event) => addOrderFieldValue(event.target.value)}
              >
                <option>Red</option>
                <option>Orange</option>
                <option>Yellow</option>
                <option>Blue (Limited)</option>
              </Select>
              <FormLabel>Decoration Colour</FormLabel>
            </FormControl>

            <h3>Quantity:</h3>
            <HStack maxW="320px">
              <Button
                {...dec}
                style={{ marginBottom: 10 }}
                colorScheme="orange"
              >
                -
              </Button>
              <Input
                value={quantity}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  console.log("quantitychange: ", quantity);
                }}
                {...input}
              />
              <Button {...inc} colorScheme="orange">
                +
              </Button>
            </HStack>

            <h3>Date of Collection:</h3>
            <DatePicker
              selected={dateOfCollection}
              onChange={(date) => setDateOfCollection(date)}
              minDate={datePickerMinDate}
              defaultValue={datePickerMinDate}
              value={
                dateOfCollection === null ? datePickerMinDate : dateOfCollection
              }
              required
            />

            <Box mt={4} display="flex" alignItems="center">
              <Button bg="#E2725B" colorScheme="white" type="submit" w="100%">
                Send Order
              </Button>
            </Box>
          </form>
        </div>
      </div>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>
            Successfully created order for {listingName}!
          </ModalHeader>
          <Flex>
            <Spacer />
            <ModalBody>
              <img
                width="250px"
                height="250px"
                src={require("../assets/successful_order.gif")}
                alt="listing product"
              />
            </ModalBody>
            <Spacer />
          </Flex>
          <Flex>
            <Spacer />
            <ModalFooter>
              <Button
                onClick={routeChangeToHomepage}
                colorScheme="orange"
                variant="ghost"
              >
                Return to Shop
              </Button>
            </ModalFooter>
            <Spacer />
          </Flex>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default BuyerListingPage;

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
