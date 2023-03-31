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

const Seller = ({
  sellerId,
  name,
  username,
  email,
  phoneNo,
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
    onBan({ sellerId, name, username, email, phoneNo, isBanned });
  };

  const handleUnban = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to unban this user?"
    );
    if (!confirmed) {
      return;
    }
    onUnban({ sellerId, name, username, email, phoneNo, isBanned });
  };
  return (
    <Card maxW="sm">
      <CardBody>
        <Stack mt="6" spacing="3">
          <Heading size="md">{name}</Heading>
          <Text> {username}</Text>
          <Text> {email}</Text>
          <Text> {phoneNo}</Text>
          <Text>Is Banned: {isBanned ? "Yes" : "No"}</Text>

          {isBanned ? (
            <Button bg="#E2725B" onClick={handleUnban}>
              Unban seller
            </Button>
          ) : (
            <Button bg="#E2725B" onClick={handleBan}>
              Ban seller
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

export default Seller;
