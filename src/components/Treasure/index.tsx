import { ItemsContextType } from "@/components/commons/Item";
import { TreasureType } from "@/data/treasure";
import { ShipType } from "@/data/ship";
import { createContext, ParentComponent } from "solid-js";
import "./Treasure.css";
import TreasureDisplay from "./TreasureDisplay";
import TreasureSearch from "./TreasureSearch";
import { CardsCollapseProvider } from "@/App";

export const TreasureItemsContext = createContext<
  ItemsContextType<TreasureType>
>({
  add: () => {
    //
  },
});

const TreasureItemsProvider: ParentComponent = (props) => {
  return (
    <TreasureItemsContext.Provider value={{} as any}>
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
