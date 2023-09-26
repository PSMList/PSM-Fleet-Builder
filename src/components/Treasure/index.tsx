import { ItemsContextType } from "@/components/commons/Item";
import { TreasureType } from "@/data/treasure";
import { createContext, ParentComponent } from "solid-js";
import "./Treasure.css";
import TreasureDisplay from "./TreasureDisplay";
import TreasureSearch from "./TreasureSearch";
import { CardsCollapseProvider } from "@/App";

const defaultContext = {
  add: () => {
    //
  },
};

export const TreasureItemsContext =
  createContext<ItemsContextType<TreasureType>>(defaultContext);

const TreasureItemsProvider: ParentComponent = (props) => {
  return (
    <TreasureItemsContext.Provider value={defaultContext}>
      {props.children}
    </TreasureItemsContext.Provider>
  );
};

interface TreasureProps {
  treasures: TreasureType[];
  remainingFleetPoints: number;
}

const Treasure = (props: TreasureProps) => {
  return (
    <div class="main_container" id="treasure_container">
      <TreasureItemsProvider>
        <CardsCollapseProvider collapse={true}>
          <TreasureSearch />
        </CardsCollapseProvider>
        <CardsCollapseProvider>
          <TreasureDisplay
            treasures={props.treasures}
            remainingFleetPoints={props.remainingFleetPoints}
          />
        </CardsCollapseProvider>
      </TreasureItemsProvider>
    </div>
  );
};

export default Treasure;
