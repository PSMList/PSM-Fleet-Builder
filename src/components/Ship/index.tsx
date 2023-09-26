import { ItemsContextType } from "@/components/commons/Item";
import { ShipType } from "@/data/ship";
import { createContext, ParentComponent } from "solid-js";
import FleetDisplay from "./FleetDisplay";
import "./Ship.css";
import ShipSearch from "./ShipSearch";
import { CardsCollapseProvider } from "@/App";

const defaultContext = {
  add: () => {
    //
  },
};

export const ShipItemsContext =
  createContext<ItemsContextType<ShipType>>(defaultContext);

const ShipItemsProvider: ParentComponent = (props) => {
  return (
    <ShipItemsContext.Provider value={defaultContext}>
      {props.children}
    </ShipItemsContext.Provider>
  );
};

const Ship = () => {
  return (
    <div class="main_container" id="fleet_container">
      <ShipItemsProvider>
        <CardsCollapseProvider collapse={true}>
          <ShipSearch />
        </CardsCollapseProvider>
        <CardsCollapseProvider>
          <FleetDisplay />
        </CardsCollapseProvider>
      </ShipItemsProvider>
    </div>
  );
};

export default Ship;
