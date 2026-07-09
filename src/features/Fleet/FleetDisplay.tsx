import { createStore } from "solid-js/store";

import { ItemsProvider } from "@/common/Item/ItemsProvider";
import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { Icon } from "@/common/Icon/Icon";
import {
  CopyFleet,
  ExportFleet,
  ImportFleet,
  SaveFleet,
  ShareFleet,
  ShowHarbor,
  ShowSettings,
} from "@/features/Fleet/actions";
import { FleetDataType, FleetShip, useFleet } from "@/store/services/fleet";
import { useModal } from "@/common/Modal/ModalProvider";
import { objectId } from "@/utils/id";
import { capitalize } from "@/utils/string";
import { getShipCost } from "@/utils/points";
import { Item, ItemsType } from "@/common/Item/ItemCard";
import { useFactionFilter } from "@/common/filters/faction";
import { useCommonFilters, useCommonSorts } from "@/common/filters/common";
import { useShipSorts } from "@/common/sorts/ship";
import { useSortAsFilter } from "@/common/filters/sort";
import { FilterProps } from "@/common/Search/Search";
import { Builder } from "@/common/Builder/Builder";
import { CrewItem } from "@/store/data/crew";
import { EquipmentItem } from "@/store/data/equipment";
import { CrewCard } from "../items/Crew/CrewCard/CrewCard";
import { EquipmentCard } from "../items/Equipment/EquipmentCard/EquipmentCard";
import { DisplayCard } from "@/common/Display/DisplayCard/DisplayCard";
import { SearchCard } from "@/common/Search/SearchCard/SearchCard";
import { AddItems } from "@/common/Display/actions";
import { ShipItemBase } from "./ShipItem";

type LinkedItemType = "crew" | "equipment";

const LinkedItemCard = {
  crew: CrewCard,
  equipment: EquipmentCard,
};

interface LinkedItemsBuilderProps {
  type: LinkedItemType;
  linkedTypeName: ItemsType;
  ship: FleetShip;
  selectedItems: CrewItem[] | EquipmentItem[];
  factionFilters: FilterProps<any>[];
  extensionFilters: FilterProps<any>[];
  fleetPoints: FleetDataType["points"];
}

function LinkedItemsBuilder(props: LinkedItemsBuilderProps) {
  const filters = () =>
    props.type === "crew" ? props.factionFilters : props.extensionFilters;

  const current = () => getShipCost({ [props.type]: props.selectedItems });
  const total = () => props.fleetPoints.max - props.fleetPoints.current + current();

  const ItemCard = LinkedItemCard[props.type];

  function DisplaySubTypeItem({ item }: { item: Item }) {
    return <DisplayCard item={item as CrewItem} component={ItemCard} />;
  }

  function SearchSubTypeItem({ item }: { item: Item }) {
    return <SearchCard item={item as CrewItem} component={ItemCard} />;
  }

  return (
    <Builder
      addItems={<AddItems type={props.linkedTypeName} />}
      header={
        <>
          <span class="room">
            <Icon id="boxes" />
            &nbsp;&nbsp;{props.ship.room?.()}&nbsp;/&nbsp;{props.ship.cargo}
          </span>
          <div class="points">
            <Icon id="coins" />
            &nbsp;&nbsp;{current()}&nbsp;/&nbsp;{total()}
          </div>
        </>
      }
      filters={filters()}
      displayItem={DisplaySubTypeItem}
      searchItem={SearchSubTypeItem}
      type={props.linkedTypeName}
    />
  );
}

export function FleetDisplay() {
  const commonSorts = useCommonSorts();
  const shipSorts = useShipSorts();

  const commonSortsFilter = useSortAsFilter(commonSorts);
  const shipSortsFilter = useSortAsFilter([...commonSorts, ...shipSorts]);

  const factionFilter = useFactionFilter();
  const commonFilters = useCommonFilters();

  const extensionFilters = [...commonFilters, commonSortsFilter];
  const factionFilters = [factionFilter, ...extensionFilters];
  const shipFilters = [factionFilter, ...commonFilters, shipSortsFilter];

  const modal = useModal();
  const { fleet } = useFleet();

  function showLinkedItems(type: LinkedItemType, ship: FleetShip) {
    const [selectedItems, setSelectedItems] = createStore(ship[type]);
    const linkedTypeName = (type === "crew" ? "crew" : type + "s") as ItemsType;

    modal.show({
      id: `add-${type}-${objectId(ship)}`,
      title: `${capitalize(type)} manager`,
      subtitle: ship.fullname,
      onClose: true,
      content: () => (
        <ItemsProvider
          items={selectedItems}
          onChange={(_items) => {
            setSelectedItems(() => _items as typeof selectedItems);
          }}
        >
          <LinkedItemsBuilder
            type={type}
            linkedTypeName={linkedTypeName}
            ship={ship}
            selectedItems={selectedItems}
            factionFilters={factionFilters}
            extensionFilters={extensionFilters}
            fleetPoints={fleet.points}
          />
        </ItemsProvider>
      ),
    });
  }

  const header = (
    <>
      <h2>{fleet.name}</h2>
      <div class="points">
        <Icon id="coins" />
        &nbsp;&nbsp;{fleet.points.current}&nbsp;/&nbsp;{fleet.points.max}
      </div>
      <ShowSettings />
    </>
  );

  const actions = (
    <>
      <ShowHarbor />
      <CopyFleet />
      <SaveFleet />
      <ShareFleet />
      <ExportFleet />
      <ImportFleet />
    </>
  );

  function SearchShipItem({ item }: { item: FleetShip }) {
    return <SearchCard item={item} component={ShipItemBase} />;
  }

  function DisplayShipItem({ item }: { item: FleetShip }) {
    return (
      <DisplayCard
        item={item}
        component={(props) => (
          <ShipItemBase
            item={item}
            actions={
              <>
                <IconButton
                  onClick={() => showLinkedItems("crew", item)}
                  data-crew-room={item.crew.length || null}
                  id="users-cog"
                  title="Show crew"
                />
                <IconButton
                  onClick={() => showLinkedItems("equipment", item)}
                  data-equipments-room={item.equipment.length || null}
                  id="dolly-box"
                  title="Show equipments"
                />
                {props.actions}
              </>
            }
          />
        )}
      />
    );
  }

  return (
    <Builder
      type="ships"
      displayItem={DisplayShipItem}
      searchItem={SearchShipItem}
      addItems={<AddItems type="ships" />}
      header={header}
      actions={actions}
      filters={shipFilters}
    />
  );
}
