import { ItemsContextType } from "@/components/commons/Item";
import { EquipmentType } from "@/data/equipment";
import { ShipType } from "@/data/ship";
import { createContext, ParentComponent } from "solid-js";
import "./Equipment.css";
import EquipmentDisplay from "./EquipmentDisplay";
import EquipmentSearch from "./EquipmentSearch";
import { CardsCollapseProvider } from "@/App";

const defaultContext = {
  add: () => {
    //
  },
};

export const EquipmentItemsContext =
  createContext<ItemsContextType<EquipmentType>>(defaultContext);

const EquipmentItemsProvider: ParentComponent = (props) => {
  return (
    <EquipmentItemsContext.Provider value={defaultContext}>
      {props.children}
    </EquipmentItemsContext.Provider>
  );
};

interface EquipmentProps {
  ship: ShipType;
  remainingFleetPoints: number;
}

const Equipment = (props: EquipmentProps) => {
  return (
    <div class="main_container" id="equipment_container">
      <EquipmentItemsProvider>
        <CardsCollapseProvider collapse={true}>
          <EquipmentSearch />
        </CardsCollapseProvider>
        <CardsCollapseProvider>
          <EquipmentDisplay
            ship={props.ship}
            remainingFleetPoints={props.remainingFleetPoints}
          />
        </CardsCollapseProvider>
      </EquipmentItemsProvider>
    </div>
  );
};

export default Equipment;
