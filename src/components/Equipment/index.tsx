import { ItemsContextType } from "@/components/commons/Item";
import { EquipmentType } from "@/data/equipment";
import { ShipType } from "@/data/ship";
import { createContext, ParentComponent } from "solid-js";
import "./Equipment.css";
import EquipmentDisplay from "./EquipmentDisplay";
import EquipmentSearch from "./EquipmentSearch";
import { CardsCollapseProvider } from "@/App";

export const EquipmentItemsContext = createContext<
  ItemsContextType<EquipmentType>
>({
  add: () => {
    //
  },
});

const EquipmentItemsProvider: ParentComponent = (props) => {
  return (
    <EquipmentItemsContext.Provider value={{} as any}>
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
