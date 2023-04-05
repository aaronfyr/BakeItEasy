import { Grid, GridItem, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Seller from "../components/seller";
import AdminMenuBar from "../components/adminMenuBar";

function ViewAllSellers() {
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:8080/BakeItEasy-war/webresources/sellers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const res = await response.json();
        setSellers(res);
      } else {
        setError("There is an error with loading sellers");
      }
    }

    fetchData();
  }, []);

  const handleBan = async (bannedSeller) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/ban/sellers/${bannedSeller.sellerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedSellers = sellers.map((seller) => {
        if (seller.sellerId === bannedSeller.sellerId) {
          return {
            ...seller,
            isBanned: true,
          };
        } else {
          return seller;
        }
      });
      setSellers(updatedSellers);
    } else {
      setError("There is an error with the ban request");
    }
  };

  const handleUnban = async (unbannedSeller) => {
    const response = await fetch(
      `http://localhost:8080/BakeItEasy-war/webresources/admins/unban/sellers/${unbannedSeller.sellerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const updatedSellers = sellers.map((seller) => {
        if (seller.sellerId === unbannedSeller.sellerId) {
          return {
            ...seller,
            isBanned: false,
          };
        } else {
          return seller;
        }
      });
      setSellers(updatedSellers);
    } else {
      setError("There is an error with the unban request");
    }
  };

  return (
    <div>
      <AdminMenuBar />
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" mb={8}>
          Sellers
        </Text>
      </Box>
      {sellers.length === 0 ? (
        <Box textAlign="center">
          <Text>No sellers found</Text>
        </Box>
      ) : (
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {sellers.map((seller) => (
            <GridItem key={seller.sellerId} colSpan={1}>
              <Seller
                sellerId={seller.sellerId}
                name={seller.name}
                username={seller.username}
                email={seller.email}
                phoneNo={seller.phoneNo}
                isBanned={seller.isBanned}
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

export default ViewAllSellers;