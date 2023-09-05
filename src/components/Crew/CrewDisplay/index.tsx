import { onlyDisplay } from "@/App";
import Display from "@/components/commons/Display";
import IconButton from "@/components/commons/IconButton";
import { ToastContext } from "@/components/commons/Toasts";
import { CrewItemsContext } from "@/components/Crew";
import CrewItem from "@/components/Crew/CrewItem";
import { CrewType } from "@/data/crew";
import { ShipType } from "@/data/ship";
import { createEffect, For, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import "./CrewDisplay.css";

export type CrewSavedDataType = {
  id: number;
};

export type CrewDataType = {
  points: {
    current: number;
    max: number;
  };
  room: {
    current: number;
    max: number;
  };
  crews: CrewType[];
};

type CrewDisplayProps = {
  ship: ShipType;
  remainingFleetPoints: number;
};

const CrewDisplay = (props: CrewDisplayProps) => {
  const [crewData, setData] = createStore<CrewDataType>({
    points: {
      current: 0,
      max: 0,
    },
    room: {
      current: 0,
      max: props.ship.cargo,
    },
    crews: [],
  });

  createEffect(() => {
    setData("room", "current", crewData.crews.length);
  });

  createEffect(() => {
    setData(
      produce((data) => {
        data.crews = props.ship.crew;
        data.points.current = data.crews.reduce((total: number, crew: CrewType) => total + crew.points, 0);
        data.points.max = data.points.current + props.remainingFleetPoints;
      })
    );
  });

  let displayContainer: HTMLDivElement;
  let removeCrewAction: (crew: CrewType) => JSX.Element | undefined;
  let crewActions: JSX.Element | undefined;

  if (!onlyDisplay) {
    const toastContext = useContext(ToastContext);

    const crewItemsContext = useContext(CrewItemsContext);

    const addCrew = (crew: CrewType) => {
      if (props.ship.crew.length + 1 > props.ship.cargo)
        toastContext.createToast({
          id: "warning-exceeding-cargo",
          type: "warning",
          title: "Add crew",
          description: "Exceeding cargo limit.",
        });
      if (crew.faction.id !== props.ship.faction.id)
        toastContext.createToast({
          id: "warning-different-faction",
          type: "warning",
          title: "Add crew",
          description: "Different faction for crew and its ship.",
        });
      if (props.ship.crew.some((_crew) => _crew.name === crew.name))
        toastContext.createToast({
          id: "warning-same-crew",
          type: "warning",
          title: "Add crew",
          description: "Crew with the same name.",
        });
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
          data.crews.push({ ...crew });
        })
      );
    };

    crewItemsContext.add = addCrew;

    const removeCrew = (crew: CrewType) => {
      const crewIndex = crewData.crews.findIndex((_crew) => crew === _crew);
      if (crewIndex >= 0) {
        setData(
          produce((data) => {
            data.crews.splice(crewIndex, 1);
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
          data.crews.length = 0;
        })
      );
    };

    const scrollToDisplayBottom = () => {
      if (displayContainer) {
        const scrollElement = document.querySelector("#modal-root .modal-shadow:not(.hidden) .modal-content")!;
        scrollElement.scrollTo({
          top: scrollElement.scrollTop + displayContainer.getBoundingClientRect().top + displayContainer.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    crewActions = (
      <>
        <IconButton iconID="search-plus" onClick={scrollToDisplayBottom} class="scroll_to_search" />
        <IconButton iconID="eraser" class="clear" onClick={clearCrew} title="Clear all crew" />
      </>
    );

    removeCrewAction = (crew: CrewType) => (
      <IconButton iconID="minus-square" onClick={() => removeCrew(crew)} title="Remove crew" />
    );
  }

  const headerInfo = (
    <>
      <span class="room">
        <i class="fas fa-users" />
        &nbsp;&nbsp;{crewData.room.current}&nbsp;/&nbsp;{crewData.room.max}
      </span>
      &nbsp;&nbsp;
      <span class="points">
        <i class="fas fa-coins" />
        &nbsp;&nbsp;{crewData.points.current}&nbsp;/&nbsp;{crewData.points.max}
      </span>
    </>
  );

  const shipCrew = (
    <For each={crewData.crews}>
      {(crew) => <CrewItem data={crew} actions={removeCrewAction && removeCrewAction(crew)} />}
    </For>
  );

  return <Display ref={(ref) => (displayContainer = ref)} info={headerInfo} actions={crewActions} items={shipCrew} />;
};

export default CrewDisplay;
