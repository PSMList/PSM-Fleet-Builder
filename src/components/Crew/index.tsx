import { ItemsContextType } from "@/components/commons/Item";
import { CrewType } from "@/data/crew";
import { ShipType } from "@/data/ship";
import { createContext, ParentComponent } from "solid-js";
import "./Crew.css";
import CrewDisplay from "./CrewDisplay";
import CrewSearch from "./CrewSearch";
import { CardsCollapseProvider } from "@/App";

const defaultContext = {
  add: () => {
    //
  },
};

export const CrewItemsContext =
  createContext<ItemsContextType<CrewType>>(defaultContext);

const CrewItemsProvider: ParentComponent = (props) => {
  return (
    <CrewItemsContext.Provider value={defaultContext}>
      {props.children}
    </CrewItemsContext.Provider>
  );
};

interface CrewProps {
  ship: ShipType;
  remainingFleetPoints: number;
}

const Crew = (props: CrewProps) => {
  return (
    <div class="main_container" id="crew_container">
      <CrewItemsProvider>
        <CardsCollapseProvider collapse={true}>
          <CrewSearch defaultFactionID={props.ship.faction.id.toString()} />
        </CardsCollapseProvider>
        <CardsCollapseProvider>
          <CrewDisplay
            ship={props.ship}
            remainingFleetPoints={props.remainingFleetPoints}
          />
        </CardsCollapseProvider>
      </CrewItemsProvider>
    </div>
  );
};

export default Crew;
