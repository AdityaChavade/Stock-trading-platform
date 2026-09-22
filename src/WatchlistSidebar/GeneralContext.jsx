import { useState, createContext } from "react";
import BuyActionWindow from "./BuyActionWindow";

export const Context = createContext({
  openActionWindow: () => {},
  closeActionWindow: () => {}
});

export function GeneralContext({ children }) {

  const [showActionWindow, setShowActionWindow] = useState(false);
  const [stock, setStock] = useState("");
  const [price,setprice]=useState("");
  const [action, setAction] = useState("");

  function openActionWindow(uid, price, actionType) {
    setStock(uid);
    setprice(price);
    setAction(actionType);
    setShowActionWindow(true);
  }

  function closeActionWindow() {
    setShowActionWindow(false);
  }

  return (
    <Context.Provider value={{ openActionWindow, closeActionWindow }}>
      {children}
      {showActionWindow && <BuyActionWindow uid={stock} price={price} action={action} />}
    </Context.Provider>
  );
}

export default GeneralContext;