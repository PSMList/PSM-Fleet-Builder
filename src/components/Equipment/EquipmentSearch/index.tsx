import { onlyDisplay } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Search, { SearchItemType } from "@/components/commons/Search";
import { EquipmentItemsContext } from "@/components/Equipment";
import EquipmentItem from "@/components/Equipment/EquipmentItem";
import { EquipmentType } from "@/data/equipment";
import { useStore } from "@/data/store";
import { createEffect, createSignal, useContext } from "solid-js";
import "./EquipmentSearch.css";

const EquipmentSearch = () => {
  // eslint-disable-next-line solid/components-return-once
  if (onlyDisplay) return <></>;

  const equipmentItemsContext = useContext(EquipmentItemsContext);

  const { database } = useStore().databaseService;

  const selectItem = (equipment: EquipmentType) => {
    equipmentItemsContext.add(equipment);
  };

  const [elements, setElements] = createSignal([] as SearchItemType[]);
  createEffect(() => {
    const equipments = Array.from(database.equipments.values());
    setElements(() =>
      equipments.map(
        (equipment: EquipmentType) =>
          ({
            item: equipment,
            search_field: equipment.fullname,
            element: (
              <EquipmentItem
                data={equipment}
                actions={
                  <IconButton
                    iconID="plus-square"
                    onClick={() => selectItem(equipment)}
                    title="Add equipment"
                  />
                }
              />
            ),
          } as SearchItemType)
      )
    );
  });

  return (
    <Search
      placeholder="Search by equipment name or ID"
      items={elements()}
      hideFactionFilter={true}
    />
  );
};

export default EquipmentSearch;
