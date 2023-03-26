import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "../components/starIcon";
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  Button,
  Image,
  Text
} from "@chakra-ui/react";

function MakeReview({ order }) {
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState("");

  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPicture(reader.result);
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/orders/${order.id}/reviews}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          picture,
          description,
        }),
      }
    );

    if (response.ok) {
      if (picture) {
        //saveReviewPic(type, user.id, profilePic);
      }

      // go back to order details
      navigate(-1);
    } else {
      // show error message
      setError("Invalid review. Please try again.");
    }
  };

  return (
    <Box
      maxW="xxl"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      h="xl"
      display="flex"
    >
      <Box flex="1">
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Rating</FormLabel>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                color={i <= rating ? "yellow.500" : "gray.300"}
                onClick={() => setRating(i)}
              />
            ))}
          </FormControl>

          <FormLabel mt={6}>Picture</FormLabel>
          <Input
            type="file"
            placeholder=" "
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
          />
          {picture && <Image src={picture} />}

          <FormControl>
            <FormLabel>Description:</FormLabel>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </FormControl>

          <Box mt={4} display="flex" alignItems="center">
            <Button bg="#E2725B" colorScheme="white" type="submit" w="100%">
              Submit
            </Button>
          </Box>
        </form>
      </Box>

      <Box flex="1">
        <Box display="flex" alignItems="center">
          <Image src={order.seller.profilePicture} mr={4} />
          <Text fontWeight="bold">{order.seller.username}</Text>
        </Box>

        <Box mt={4} display="flex" alignItems="center">
          <Image src={order.listing.picture} mr={4} />
          <Text fontWeight="bold">{order.listing.name}</Text>
        </Box>

        <Box mt={4}>
          <Text>
            Order ID: <Text as="span">{order.id}</Text>
          </Text>
          <Text>
            Price: <Text as="span">{order.price}</Text>
          </Text>
          <Text>
            Date: <Text as="span">{order.date}</Text>
          </Text>
          <Text>
            Quantity: <Text as="span">{order.quantity}</Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export default MakeReview;
