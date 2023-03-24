import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

const Buyer = ({ name, username, email, phoneNo, address, isBanned }) => {
  const handleClick = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to ban this user?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`http://localhost:8080/buyers/ban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });
  };
  return (
    <Card maxW="sm">
      <CardBody>
        <Stack mt="6" spacing="3">
          <Heading size="md">{name}</Heading>
          <Text> {username}</Text>
          <Text> {email}</Text>
          <Text> {phoneNo}</Text>
          <Text> {address}</Text>
          <Text>Is Banned: {isBanned ? "Yes" : "No"}</Text>

          <Button
            bg="#E2725B"
            onClick={handleClick}
            visibility={isBanned ? "hidden" : "visible"}
          >
            Ban buyer
          </Button>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
};

export default Buyer;
