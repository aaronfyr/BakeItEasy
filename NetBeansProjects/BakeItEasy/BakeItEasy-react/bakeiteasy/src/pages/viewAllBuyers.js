import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Buyer from "../components/buyer";

function ViewAllBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/http://localhost:8080/buyers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const res = await response.json();
        setBuyers(res);
      } else {
        setError("There is an error with the buyer loading");
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Buyers</h1>
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
