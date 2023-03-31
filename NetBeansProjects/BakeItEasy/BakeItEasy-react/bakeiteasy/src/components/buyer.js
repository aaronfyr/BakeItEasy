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

const Buyer = ({
  buyerId,
  name,
  username,
  email,
  phoneNo,
  address,
  isBanned,
  onBan,
  onUnban,
}) => {
  const handleBan = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm("Are you sure you want to ban this user?");
    if (!confirmed) {
      return;
    }
    onBan({ buyerId, name, username, email, phoneNo, address, isBanned });
  };

  const handleUnban = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to unban this user?"
    );
    if (!confirmed) {
      return;
    }
    onUnban({ buyerId, name, username, email, phoneNo, address, isBanned });
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

          {isBanned ? (
            <Button bg="#E2725B" onClick={handleUnban}>
              Unban buyer
            </Button>
          ) : (
            <Button bg="#E2725B" onClick={handleBan}>
              Ban buyer
            </Button>
          )}
        </Stack>
      </CardBody>

      {isBanned ? (
        <CardFooter bg="red.500"></CardFooter>
      ) : (
        <CardFooter></CardFooter>
      )}

      <Divider />
    </Card>
  );
};

export default Buyer;
