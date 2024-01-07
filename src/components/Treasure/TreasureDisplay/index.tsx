import { For, JSX, Show, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { onlyDisplay, useCardsCollapse } from "@/App";
import Display from "@/components/commons/Display";
import IconButton from "@/components/commons/IconButton";
import { ToastContext } from "@/components/commons/Toasts";
import { TreasureItemsContext } from "@/components/Treasure";
import TreasureItem from "@/components/Treasure/TreasureItem";
import { TreasureType } from "@/data/treasure";
import "./TreasureDisplay.css";
import Items from "@/components/commons/Items";
import Icon from "@/components/commons/Icon";

export interface TreasureSavedDataType {
  id: number;
}

export type TreasureDataType = TreasureType[];

interface TreasureDisplayProps {
  treasures: TreasureType[];
  remainingFleetPoints: number;
}

const TreasureDisplay = (props: TreasureDisplayProps) => {
  const _treasures = () => props.treasures;
  const [treasureData, setData] = createStore<TreasureDataType>(_treasures());

  const [cardsCollapse, { toggle: toggleCardsCollapse }] = useCardsCollapse();

  const toggleIcon = (
    <IconButton
      iconID={cardsCollapse() ? "expand-arrows-alt" : "compress-arrows-alt"}
      title={cardsCollapse() ? "Expand cards" : "Compress cards"}
      onClick={toggleCardsCollapse}
    />
  );

  let displayContainer: HTMLDivElement | undefined;
  let removeTreasureAction: (treasure: TreasureType) => JSX.Element = () => (
    <></>
  );
  const treasureActions: JSX.Element[] = [];

  if (!onlyDisplay) {
    const toastContext = useContext(ToastContext);

    const treasureItemsContext = useContext(TreasureItemsContext);

    const addTreasure = (treasure: TreasureType) => {
      // eslint-disable-next-line solid/reactivity
      if (treasureData.some((_treasure) => _treasure.name === treasure.name))
        toastContext.createToast({
          id: "warning-same-treasure",
          type: "warning",
          title: "Add treasure",
          description: "Treasure with the same name.",
        });
      setData(
        produce((data) => {
          data.push({ ...treasure });
        })
      );
    };

    treasureItemsContext.add = addTreasure;

    const removeTreasure = (treasure: TreasureType) => {
      const treasureIndex = treasureData.findIndex(
        (_treasure) => treasure === _treasure
      );
      if (treasureIndex >= 0) {
        setData(
          produce((data) => {
            data.splice(treasureIndex, 1);
          })
        );
      }
    };

    const clearTreasure = () => {
      toastContext.createToast({
        id: "info-clearing",
        type: "info",
        title: "Clear treasure",
        description: "Removed treasure data (not saved).",
      });
      setData(
        produce((data) => {
          data.length = 0;
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

    treasureActions.push(
      <IconButton
        iconID="search-plus"
        onClick={scrollToDisplayBottom}
        class="scroll_to_search"
        primary
      >
        Add treasure
      </IconButton>,
      toggleIcon,
      <IconButton
        iconID="eraser"
        class="clear"
        onClick={clearTreasure}
        title="Clear all treasure"
      />
    );

    removeTreasureAction = (treasure: TreasureType) => (
      <IconButton
        iconID="trash-can"
        onClick={() => removeTreasure(treasure)}
        title="Clear treasure"
      />
    );
  } else {
    treasureActions.push(toggleIcon);
  }

  const shipTreasure = (
    <Show
      when={treasureData.length}
      fallback={
        <h3 class="items_info">
          No selected treasure, click on <Icon iconID="search-plus" /> to start.
        </h3>
      }
    >
      <Items
        classList={{
          minimized: cardsCollapse(),
          maximized: !cardsCollapse(),
        }}
      >
        <For each={treasureData}>
          {(treasure) => (
            <TreasureItem
              data={treasure}
              actions={removeTreasureAction(treasure)}
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
            <i class="fas fa-toolbox" />
            &nbsp;&nbsp;{treasureData.length}
          </span>
        </>
      }
      actions={treasureActions}
      items={shipTreasure}
    />
  );
};

export default TreasureDisplay;
