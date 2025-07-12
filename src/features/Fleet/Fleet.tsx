import "./Fleet.scss";

import { For, JSX, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { ItemsProvider } from "@/common/Item/ItemsProvider";
import { useFleet } from "@/store/store";
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
import { useModal } from "@/common/Modal/hooks";
import { baseImg, isOwn } from "@/utils/config";
import { objectId } from "@/utils/other";
import { capitalize, plural } from "@/utils/string";
import { getShipCost } from "@/utils/points";
import { ItemsType, Item } from "@/common/Item/ItemCard";
import { useFactionFilter } from "@/common/filters/faction";
import { useExtensionFilter } from "@/common/filters/extension";
import { useCommonFilters, useCommonSorts } from "@/common/filters/common";
import { useShipSorts } from "@/common/sorts/ship";
import { useSortFilter } from "@/common/filters/sort";
import { Builder } from "@/common/Builder/Builder";
import { ShipCard } from "../items/Ship/ShipCard/ShipCard";
import { Crew } from "@/store/data/crew";
import { CrewCard } from "../items/Crew/CrewCard/CrewCard";
import { EquipmentCard } from "../items/Equipment/EquipmentCard/EquipmentCard";
import { DisplayCard } from "@/common/Display/DisplayCard/DisplayCard";
import { SearchCard } from "@/common/Search/SearchCard/SearchCard";
import { FleetShip } from "@/store/services/fleet";

const LinkedItem = {
  crew: CrewCard,
  equipment: EquipmentCard,
};

function ShipItemBase({
  item,
  actions,
}: {
  item: FleetShip;
  actions?: JSX.Element;
}) {
  return (
    <ShipCard item={item} actions={actions}>
      <Show when={(item.room?.() ?? 0) > 0}>
        <ul class="cargo">
          <li class="expand">
            <span class="points">
              {item.crew.reduce((total, crew) => total + crew.points, 0) +
                item.equipment.reduce(
                  (total, equipment) => total + equipment.points,
                  0,
                )}
            </span>
            <Show when={item.crew.length}>
              <span>{item.crew.length} crew</span>
            </Show>
            <Show when={item.equipment.length}>
              <span>{plural("equipment", item.equipment.length)}</span>
            </Show>
          </li>
          <For each={item.crew}>
            {(crew) => (
              <li class="collapse">
                <span class="points">{crew.points}</span>
                <span class="name">{crew.fullname}</span>
                <img
                  class="faction"
                  src={`${baseImg}/${crew.faction.icon}`}
                  alt={crew.faction.name}
                />
              </li>
            )}
          </For>
          <For each={item.equipment}>
            {(equipment) => (
              <li class="collapse">
                <span class="points">{equipment.points}</span>
                <span class="name">{equipment.fullname}</span>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </ShipCard>
  );
}

export function _Fleet() {
  const commonSorts = useCommonSorts();
  const shipSorts = useShipSorts();

  const commonSortsFilter = useSortFilter(commonSorts);
  const shipSortsFilter = useSortFilter([...commonSorts, ...shipSorts]);

  const factionFilter = useFactionFilter();
  const extensionFilter = useExtensionFilter();
  const commonFilters = useCommonFilters();

  const extensionFilters = [
    extensionFilter,
    ...commonFilters,
    commonSortsFilter,
  ];
  const factionFilters = [
    factionFilter,
    ...extensionFilters,
    commonSortsFilter,
  ];

  const shipFilters = [
    factionFilter,
    extensionFilter,
    ...commonFilters,
    shipSortsFilter,
  ];

  const modal = useModal();
  const { fleet } = useFleet();

  function showLinkedItems(
    type: "crew" | "equipment",
    ship: (typeof fleet.data)[number],
  ) {
    const [selectedItems, setSelectedItems] = createStore(ship[type]);

    const linkedTypeName = (type === "crew" ? "crew" : type + "s") as ItemsType;

    function LinkedItems() {
      const filters = type === "crew" ? factionFilters : extensionFilters;

      function header() {
        const current = getShipCost({
          [type]: selectedItems,
        });

        const total = fleet.points.max - fleet.points.current + current;

        return (
          <>
            <span class="room">
              <Icon id="boxes" />
              &nbsp;&nbsp;{ship.room?.()}&nbsp;/&nbsp;{ship.cargo}
            </span>
            <div class="points">
              <Icon id="coins" />
              &nbsp;&nbsp;{current}&nbsp;/&nbsp;{total}
            </div>
          </>
        );
      }

      const Item = LinkedItem[type];

      function DisplaySubTypeItem({ item }: { item: Item }) {
        return <DisplayCard item={item as Crew} component={Item} />;
      }

      function SearchSubTypeItem({ item }: { item: Item }) {
        return <SearchCard item={item as Crew} component={Item} />;
      }

      return (
        <Builder
          header={header()}
          filters={filters}
          displayItem={DisplaySubTypeItem}
          searchItem={SearchSubTypeItem}
          name={linkedTypeName}
        />
      );
    }

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
          <LinkedItems />
        </ItemsProvider>
      ),
    });
  }

  function showCrew(ship: FleetShip) {
    return showLinkedItems("crew", ship);
  }
  function showEquipments(ship: FleetShip) {
    return showLinkedItems("equipment", ship);
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
                  onClick={() => showCrew(item)}
                  data-crew-room={item.crew.length || null}
                  id="users-cog"
                  title="Show crew"
                />
                <IconButton
                  onClick={() => showEquipments(item)}
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
      name="ships"
      displayItem={DisplayShipItem}
      searchItem={SearchShipItem}
      header={header}
      actions={actions}
      filters={shipFilters}
    />
  );
}

export function Fleet() {
  const { fleet, setFleet } = useFleet();

  return (
    <ItemsProvider
      items={fleet.data}
      onChange={(items) => {
        setFleet(
          produce((_fleet) => {
            _fleet.data = items.map((item) => {
              if (!item.crew) item.crew = [];
              if (!item.equipment) item.equipment = [];

              return item;
            });
          }),
        );
      }}
    >
      <Show when={!isOwn && fleet.description}>
        <div class="description whitebox">
          <textarea
            readonly
            ref={(ref) => {
              setTimeout(() => {
                ref.style.height = ref.scrollHeight.toString() + "px";
              });
            }}
          >
            {fleet.description}
          </textarea>
        </div>
      </Show>
      <_Fleet />
    </ItemsProvider>
  );
}
