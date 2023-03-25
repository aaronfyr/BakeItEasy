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

  return (
    <div>
      <AdminMenuBar />
      <Box textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" mb={8}>
          Buyers
        </Text>
      </Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {buyers.map((buyer) => (
          <GridItem key={buyer.id} colSpan={1}>
            <Buyer
              name={buyer.name}
              username={buyer.username}
              email={buyer.email}
              phoneNo={buyer.phoneNo}
              address={buyer.address}
              isBanned={buyer.isBanned}
            />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}

export default ViewAllBuyers;
