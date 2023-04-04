import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Buyer from "../components/buyer";
import AdminMenuBar from "../components/adminMenuBar";

function ViewAllBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/buyers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const res = await response.json();
        setBuyers(res);
      } else {
        setError("There is an error with loading buyers");
      }
    }

    fetchData();
  }, []);

  const handleBan = async (bannedBuyer) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/ban/buyers/${bannedBuyer.buyerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedBuyers = buyers.map((buyer) => {
        if (buyer.buyerId === bannedBuyer.buyerId) {
          return {
            ...buyer,
            isBanned: true,
          };
        } else {
          return buyer;
        }
      });
      setBuyers(updatedBuyers);
    } else {
      setError("There is an error with the ban request");
    }
  };

  const handleUnban = async (unbannedBuyer) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/unban/buyers/${unbannedBuyer.buyerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedBuyers = buyers.map((buyer) => {
        if (buyer.buyerId === unbannedBuyer.buyerId) {
          return {
            ...buyer,
            isBanned: false,
          };
        } else {
          return buyer;
        }
      });
      setBuyers(updatedBuyers);
    } else {
      setError("There is an error with the unban request");
    }
  };

  return (
    <div>
      <AdminMenuBar />
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" mb={8}>
          Buyers
        </Text>
      </Box>
      {buyers.length === 0 ? (
        <Box textAlign="center">
          <Text>No buyers found</Text>
        </Box>
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {buyers.map((buyer) => (
            <GridItem key={buyer.buyerId} colSpan={1}>
              <Buyer
                buyerId={buyer.buyerId}
                name={buyer.name}
                username={buyer.username}
                email={buyer.email}
                phoneNo={buyer.phoneNo}
                address={buyer.address}
                isBanned={buyer.isBanned}
                onBan={handleBan}
                onUnban={handleUnban}
              />
            </GridItem>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default ViewAllBuyers;
