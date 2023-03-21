import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import {
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";

const Listing = ({ listing }) => {
  return (
    <Card maxW="sm">
      <CardBody>
        <Image
          src={listing.image.value}
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading
            size="md"
            src={listing.title.value}
            alt="Listing title"
          ></Heading>
          <Text src={listing.description.value} alt="Description"></Text>
          <Text
            src={listing.price.value}
            alt="Chat for price"
            color="blue.600"
            fontSize="2xl"
          ></Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            Buy now
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default Listing;
