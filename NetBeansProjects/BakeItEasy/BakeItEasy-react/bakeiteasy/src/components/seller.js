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
  imagePath,
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
        <Stack spacing="3">
          <div className="homepageProfilePhoto">
            <img
              className="homepageProfilePhotoImg"
              src={imagePath}
              alt="Profile Image"
            />
          </div>
          <Text>
            <strong>Name: </strong>
            {name}
          </Text>
          <Text>
            <strong>Username: </strong>
            {username}
          </Text>
          <Text>
            <strong>Email: </strong>
            {email}
          </Text>
          <Text>
            <strong>Phone Number: </strong>
            {phoneNo}
          </Text>

          {isBanned ? (
            <Button bg="#E2725B" colorScheme="white" onClick={handleUnban}>
              Unban seller
            </Button>
          ) : (
            <Button bg="#E2725B" colorScheme="white" onClick={handleBan}>
              Ban seller
            </Button>
          )}
        </Stack>
      </CardBody>

      {isBanned && (
        <CardFooter bg="red.500" textAlign="center">
          <Text color="white" fontSize="sm" width="100%">
            This seller is banned
          </Text>
        </CardFooter>
      )}
      <Divider />
    </Card>
  );
};

export default Seller;
