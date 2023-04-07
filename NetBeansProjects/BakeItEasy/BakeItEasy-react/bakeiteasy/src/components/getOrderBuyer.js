import { useState, useEffect } from "react";

export default function useOrderBuyer(orderId) {
  const [buyer, setBuyer] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/BakeItEasy-war/webresources/orders/${orderId}/buyer`)
      .then(response => response.json())
      .then(data => setBuyer(data))
      .catch(error => console.log(error));
  }, [orderId]);

  return buyer;
}
