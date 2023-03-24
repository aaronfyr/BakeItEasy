import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Seller from "../components/seller";

function ViewAllSellers() {
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/http://localhost:8080/sellers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        setSellers(res);
      } else {
        setError("There is an error with the seller loading");
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Sellers</h1>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {sellers.map((seller) => (
          <GridItem key={seller.id} colSpan={1}>
            <Seller
              name={seller.name}
              username={seller.username}
              email={seller.email}
              phoneNo={seller.phoneNo}
              address={seller.address}
              isBanned={seller.isBanned}
            />
          </GridItem>
        ))}
      </Grid>
    </div>
  );
}

export default ViewAllSellers;
