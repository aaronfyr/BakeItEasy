import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Buyer = ({
  buyerId,
  name,
  username,
  email,
  phoneNo,
  address,
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
        <Stack spacing="3">
          <div className="adminProfilePhoto">
            <img
              className="homepageProfilePhotoImg"
              src={imagePath}
              alt="Profile"
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
          <Text>
            <strong>Address: </strong>
            {address}
          </Text>

          {isBanned ? (
            <Button bg="#E2725B" colorScheme="white" onClick={handleUnban}>
              Unban buyer
            </Button>
          ) : (
            <>
              <Link to={"/adminViewBuyerProfile?id=" + buyerId}>
                <Button
                  bg="#E2725B"
                  colorScheme="white"
                  style={{ width: "100%" }}
                >
                  View buyer
                </Button>
              </Link>
              <Button bg="#E2725B" colorScheme="white" onClick={handleBan}>
                Ban buyer
              </Button>
            </>
          )}
        </Stack>
      </CardBody>

      {isBanned && (
        <CardFooter bg="red.500" textAlign="center">
          <Text color="white" fontSize="sm" width="100%">
            This buyer is banned
          </Text>
        </CardFooter>
      )}
      <Divider />
    </Card>
  );
};

export default Buyer;
