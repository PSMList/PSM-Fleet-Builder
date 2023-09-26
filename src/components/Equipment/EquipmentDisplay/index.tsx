import { createEffect, For, JSX, Show, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { onlyDisplay, useCardsCollapse } from "@/App";
import Display from "@/components/commons/Display";
import IconButton from "@/components/commons/IconButton";
import { ToastContext } from "@/components/commons/Toasts";
import { EquipmentItemsContext } from "@/components/Equipment";
import EquipmentItem from "@/components/Equipment/EquipmentItem";
import { EquipmentType } from "@/data/equipment";
import { ShipType } from "@/data/ship";
import "./EquipmentDisplay.css";

export interface EquipmentSavedDataType {
  id: number;
}

export interface EquipmentDataType {
  points: {
    current: number;
    max: number;
  };
  room: {
    current: number;
    max: number;
  };
  equipments: EquipmentType[];
}

interface EquipmentDisplayProps {
  ship: ShipType;
  remainingFleetPoints: number;
}

const EquipmentDisplay = (props: EquipmentDisplayProps) => {
  const ship = () => props.ship;

  const [equipmentData, setData] = createStore<EquipmentDataType>({
    points: {
      current: 0,
      max: 0,
    },
    room: {
      current: 0,
      max: ship().cargo,
    },
    equipments: [],
  });

  createEffect(() => {
    setData("room", "current", ship().room());
  });

  createEffect(() => {
    setData(
      produce((data) => {
        data.equipments = props.ship.equipment;
        data.points.current = data.equipments.reduce(
          (total: number, equipment: EquipmentType) => total + equipment.points,
          0
        );
        data.points.max = data.points.current + props.remainingFleetPoints;
      })
    );
  });

  const [cardsCollapse, { toggle: toggleCardsCollapse }] = useCardsCollapse();

  const toggleIcon = (
    <IconButton
      iconID={cardsCollapse() ? "expand-arrows-alt" : "compress-arrows-alt"}
      title={cardsCollapse() ? "Expand cards" : "Compress cards"}
      onClick={toggleCardsCollapse}
    />
  );

  let displayContainer: HTMLDivElement | undefined;
  let removeEquipmentAction: (equipment: EquipmentType) => JSX.Element = () => (
    <></>
  );
  const equipmentActions: JSX.Element[] = [];

  if (!onlyDisplay) {
    const toastContext = useContext(ToastContext);

    const equipmentItemsContext = useContext(EquipmentItemsContext);

    const addEquipment = (equipment: EquipmentType) => {
      const _equipment = () => equipment;
      const _ship = ship();
      if (_ship.room() + 1 > _ship.cargo)
        toastContext.createToast({
          id: "warning-exceeding-cargo",
          type: "warning",
          title: "Add equipment",
          description: "Exceeding cargo limit.",
        });
      // eslint-disable-next-line solid/reactivity
      if (
        _ship.equipment.some(
          (equipment) => equipment.name === _equipment().name
        )
      )
        toastContext.createToast({
          id: "warning-same-equipment",
          type: "warning",
          title: "Add equipment",
          description: "Equipment with the same name.",
        });
      // eslint-disable-next-line solid/reactivity
      if (
        equipmentData.points.current + _equipment().points >
        equipmentData.points.max
      )
        toastContext.createToast({
          id: "warning-exceeding-maxpoints",
          type: "warning",
          title: "Add equipment",
          description: (
            <>
              Exceeding fleet max points.
              <br />
              <small>You can increase it in settings.</small>
            </>
          ),
        });
      setData(
        produce((data) => {
          data.equipments.push({ ...equipment });
        })
      );
    };

    equipmentItemsContext.add = addEquipment;

    const removeEquipment = (equipment: EquipmentType) => {
      const equipmentIndex = equipmentData.equipments.findIndex(
        (_equipment) => equipment === _equipment
      );
      if (equipmentIndex >= 0) {
        setData(
          produce((data) => {
            data.equipments.splice(equipmentIndex, 1);
          })
        );
      }
    };

    const clearEquipment = () => {
      toastContext.createToast({
        id: "info-clearing",
        type: "info",
        title: "Clear equipment",
        description: "Removed equipment data (not saved).",
      });
      setData(
        produce((data) => {
          data.equipments.length = 0;
        })
      );
    };

    const scrollToDisplayBottom = () => {
      if (displayContainer) {
        const searchContainer = displayContainer.previousElementSibling;
        if (searchContainer) {
          searchContainer.scrollIntoView({
            behavior: "smooth",
          });
          setTimeout(() => {
            searchContainer.scrollIntoView({
              behavior: "smooth",
            });
          }, 500);
          const input =
            searchContainer.querySelector<HTMLInputElement>("input[type=text]");
          if (input) {
            input.focus();
            input.select();
          }
        }
      }
    };

    equipmentActions.push(
      <IconButton
        iconID="search-plus"
        onClick={scrollToDisplayBottom}
        class="scroll_to_search"
        primary={true}
      >
        Search/add equipment
      </IconButton>,
      toggleIcon,
      <IconButton
        iconID="eraser"
        class="clear"
        onClick={clearEquipment}
        title="Clear all equipment"
      />
    );

    removeEquipmentAction = (equipment: EquipmentType) => (
      <IconButton
        iconID="trash-can"
        onClick={() => removeEquipment(equipment)}
        title="Clear equipment"
      />
    );
  } else {
    equipmentActions.push(toggleIcon);
  }

  const headerInfo = (
    <>
      <span class="room">
        <i class="fas fa-boxes" />
        &nbsp;&nbsp;{equipmentData.room.current}&nbsp;/&nbsp;
        {equipmentData.room.max}
      </span>
      &nbsp;&nbsp;
      <span class="points">
        <i class="fas fa-coins" />
        &nbsp;&nbsp;{equipmentData.points.current}&nbsp;/&nbsp;
        {equipmentData.points.max}
      </span>
    </>
  );

  const shipEquipment = (
    <Show
      when={equipmentData.equipments.length}
      fallback={<h3 class="items_info">No equipment</h3>}
    >
      <For each={equipmentData.equipments}>
        {(equipment) => (
          <EquipmentItem
            data={equipment}
            actions={removeEquipmentAction(equipment)}
            collapse={cardsCollapse()}
          />
        )}
      </For>
    </Show>
  );

  return (
    <Display
      ref={(ref) => {
        displayContainer = ref;
      }}
      info={headerInfo}
      actions={equipmentActions}
      items={shipEquipment}
    />
  );
};

export default EquipmentDisplay;
