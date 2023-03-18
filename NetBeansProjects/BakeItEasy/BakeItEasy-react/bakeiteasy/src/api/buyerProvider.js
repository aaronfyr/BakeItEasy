import { createContext, useState } from "react";

export const BuyerContext = createContext();

export const BuyerProvider = ({ children }) => {
  const [buyer, setBuyer] = useState(null);

  return (
    <BuyerContext.Provider value={{ buyer, setBuyer }}>
      {children}
    </BuyerContext.Provider>
  );
};