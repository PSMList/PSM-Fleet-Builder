import { createEffect, For, JSX, Show, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { onlyDisplay, useCardsCollapse } from "@/App";
import Display from "@/components/commons/Display";
import IconButton from "@/components/commons/IconButton";
import { ToastContext } from "@/components/commons/Toasts";
import { CrewItemsContext } from "@/components/Crew";
import CrewItem from "@/components/Crew/CrewItem";
import { CrewType } from "@/data/crew";
import { ShipType } from "@/data/ship";
import "./CrewDisplay.css";
import Items from "@/components/commons/Items";

export interface CrewSavedDataType {
  id: number;
}

export interface CrewDataType {
  points: {
    current: number;
    max: number;
  };
  room: {
    current: number;
    max: number;
  };
  crew: CrewType[];
}

interface CrewDisplayProps {
  ship: ShipType;
  remainingFleetPoints: number;
}

const CrewDisplay = (props: CrewDisplayProps) => {
  const ship = () => props.ship;

  const [crewData, setData] = createStore<CrewDataType>({
    points: {
      current: 0,
      max: 0,
    },
    room: {
      current: 0,
      max: ship().cargo,
    },
    crew: [],
  });

  createEffect(() => {
    setData("room", "current", ship().room());
  });

  createEffect(() => {
    setData(
      produce((data) => {
        data.crew = props.ship.crew;
        data.points.current = data.crew.reduce(
          (total: number, crew: CrewType) => total + crew.points,
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
  let removeCrewAction: (crew: CrewType) => JSX.Element = () => <></>;
  const crewActions: JSX.Element[] = [];

  if (!onlyDisplay) {
    const toastContext = useContext(ToastContext);

    const crewItemsContext = useContext(CrewItemsContext);

    const addCrew = (crew: CrewType) => {
      const _ship = ship();
      if (_ship.room() + 1 > _ship.cargo)
        toastContext.createToast({
          id: "warning-exceeding-cargo",
          type: "warning",
          title: "Add crew",
          description: "Exceeding cargo limit.",
        });
      // eslint-disable-next-line solid/reactivity
      if (crew.faction.id !== _ship.faction.id)
        toastContext.createToast({
          id: "warning-different-faction",
          type: "warning",
          title: "Add crew",
          description: "Different faction for crew and its ship.",
        });
      // eslint-disable-next-line solid/reactivity
      if (_ship.crew.some((_crew) => _crew.name === crew.name))
        toastContext.createToast({
          id: "warning-same-crew",
          type: "warning",
          title: "Add crew",
          description: "Crew with the same name.",
        });
      // eslint-disable-next-line solid/reactivity
      if (crewData.points.current + crew.points > crewData.points.max)
        toastContext.createToast({
          id: "warning-exceeding-maxpoints",
          type: "warning",
          title: "Add crew",
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
          data.crew.push({ ...crew });
        })
      );
    };

    crewItemsContext.add = addCrew;

    const removeCrew = (crew: CrewType) => {
      const crewIndex = crewData.crew.findIndex((_crew) => crew === _crew);
      if (crewIndex >= 0) {
        setData(
          produce((data) => {
            data.crew.splice(crewIndex, 1);
          })
        );
      }
    };

    const clearCrew = () => {
      toastContext.createToast({
        id: "info-clearing",
        type: "info",
        title: "Clear crew",
        description: "Removed crew data (not saved).",
      });
      setData(
        produce((data) => {
          data.crew.length = 0;
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

    crewActions.push(
      <IconButton
        iconID="search-plus"
        onClick={scrollToDisplayBottom}
        class="scroll_to_search"
        primary={true}
      >
        Add crew
      </IconButton>,
      toggleIcon,
      <IconButton
        iconID="eraser"
        class="clear"
        onClick={clearCrew}
        title="Clear all crew"
      />
    );

    removeCrewAction = (crew: CrewType) => (
      <IconButton
        iconID="trash-can"
        onClick={() => removeCrew(crew)}
        title="Clear crew"
      />
    );
  } else {
    crewActions.push(toggleIcon);
  }

  const shipCrew = (
    <Show
      when={crewData.crew.length}
      fallback={<h3 class="items_info">Empty crew</h3>}
    >
      <Items
        classList={{
          minimized: cardsCollapse(),
          maximized: !cardsCollapse(),
        }}
      >
        <For each={crewData.crew}>
          {(crew) => (
            <CrewItem
              data={crew}
              actions={removeCrewAction(crew)}
              collapse={cardsCollapse()}
            />
          )}
        </For>
      </Items>
    </Show>
  );

  return (
    <Display
      ref={(ref) => {
        displayContainer = ref;
      }}
      header={
        <>
          <span class="room">
            <i class="fas fa-boxes" />
            &nbsp;&nbsp;{crewData.room.current}&nbsp;/&nbsp;{crewData.room.max}
          </span>
          &nbsp;&nbsp;
          <span class="points">
            <i class="fas fa-coins" />
            &nbsp;&nbsp;{crewData.points.current}&nbsp;/&nbsp;
            {crewData.points.max}
          </span>
        </>
      }
      actions={crewActions}
      items={shipCrew}
    />
  );
};

export default CrewDisplay;
