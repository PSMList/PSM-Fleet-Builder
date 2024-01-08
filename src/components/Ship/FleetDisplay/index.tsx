/* eslint-disable @typescript-eslint/no-misused-promises */
import { baseUrl, hash, onlyDisplay, slug, useCardsCollapse } from "@/App";
import Display from "@/components/commons/Display";
import IconButton from "@/components/commons/IconButton";
import { ModalContext } from "@/components/commons/Modal";
import Settings from "@/components/commons/Settings";
import { ToastContext } from "@/components/commons/Toasts";
import Crew from "@/components/Crew";
import { ShipItemsContext } from "@/components/Ship";
import ShipItem from "@/components/Ship/ShipItem";
import { CrewType } from "@/data/crew";
import { ShipType } from "@/data/ship";
import { useStore } from "@/data/store";
import { fetchWithTimeout, objectId } from "@/utils";
import {
  createEffect,
  createRoot,
  createSignal,
  For,
  JSX,
  onMount,
  Show,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import "./FleetDisplay.css";
import Input from "@/components/commons/Inputs/Input";
import { EquipmentType } from "@/data/equipment";
import Equipment from "@/components/Equipment";
import Treasure from "@/components/Treasure";
import { TreasureType } from "@/data/treasure";
import Items from "@/components/commons/Items";
import Icon from "@/components/commons/Icon";

interface FleetSavedDataType {
  name: string;
  maxpoints: number;
  data: {
    id: number;
    crew?: { id: number }[];
    equipment?: { id: number }[];
  }[];
  ispublic: boolean;
  description: string;
}

export interface FleetDataType {
  name: string;
  points: {
    current: number;
    max: number;
  };
  ispublic: boolean;
  ships: ShipType[];
  treasures: TreasureType[];
  description: string;
}

const defaultFleetData: FleetDataType = {
  name: "",
  points: {
    current: 0,
    max: 0,
  },
  ships: [],
  treasures: [],
  ispublic: false,
  description: "",
};

const FleetDisplay = () => {
  const { database, loadingPromise } = useStore().databaseService;

  const [fleetData, setData] = createStore<FleetDataType>(defaultFleetData);

  function getFleetData(savedData: FleetSavedDataType): FleetDataType {
    return {
      name: savedData.name,
      points: {
        current: 0,
        max: savedData.maxpoints,
      },
      ships: savedData.data.reduce<ShipType[]>((allships, item) => {
        if (!item.crew) return allships;
        const { id: shipID, crew: crews, equipment: equipments } = item;
        const ship = database.ships.get(shipID);
        if (!ship) return allships;
        const crew = crews.reduce<CrewType[]>((allcrew, item) => {
          const crew = database.crews.get(item.id);
          if (crew)
            allcrew.push({
              ...crew,
            });
          return allcrew;
        }, []);
        const equipment = (equipments ?? []).reduce<EquipmentType[]>(
          (allequipment, item) => {
            const equipment = database.equipments.get(item.id);
            if (equipment)
              allequipment.push({
                ...equipment,
              });
            return allequipment;
          },
          []
        );
        allships.push({
          ...ship,
          crew,
          equipment,
        });
        return allships;
      }, []),
      treasures: savedData.data.reduce<TreasureType[]>((alltreasures, item) => {
        if (item.crew) return alltreasures;
        const { id: treasureID } = item;
        const treasure = database.treasures.get(treasureID);
        if (treasure) {
          alltreasures.push({
            ...treasure,
          });
        }
        return alltreasures;
      }, []),
      ispublic: savedData.ispublic,
      description: savedData.description,
    };
  }

  const [saved, setSaved] = createSignal(true);

  const setNewData = (
    newData: FleetDataType | Parameters<typeof produce<FleetDataType>>[0]
  ) => {
    if (typeof newData === "function") {
      setData(produce(newData));
    } else {
      setData(
        produce((data) => {
          data.ispublic = newData.ispublic;
          data.name = newData.name;
          data.points = newData.points;
          data.ships = newData.ships;
          data.treasures = newData.treasures;
          data.description = newData.description;
        })
      );
    }
    setSaved(() => false);
  };

  createEffect(() => {
    setData(
      "points",
      "current",
      fleetData.ships.reduce(
        (shipTotal: number, ship: ShipType) =>
          shipTotal +
          (ship.isfort ? 0 : ship.points) +
          ship.crew.reduce(
            (crewTotal: number, crew: CrewType) => crewTotal + crew.points,
            0
          ) +
          ship.equipment.reduce(
            (equipmentTotal: number, equipment: EquipmentType) =>
              equipmentTotal + equipment.points,
            0
          ),
        0
      )
    );
  });

  const fleetDataToString = () => {
    try {
      const data: FleetSavedDataType = {
        name: fleetData.name,
        maxpoints: fleetData.points.max,
        data: [
          ...fleetData.ships.map((ship) => ({
            id: ship.id,
            crew: ship.crew.map((crew) => ({
              id: crew.id,
            })),
            equipment: ship.equipment.map((equipment) => ({
              id: equipment.id,
            })),
          })),
          ...fleetData.treasures.map((treasure) => ({
            id: treasure.id,
          })),
        ],
        ispublic: fleetData.ispublic,
        description: fleetData.description,
      };
      return JSON.stringify(data);
    } catch {
      return;
    }
  };

  const modalContext = useContext(ModalContext);
  const toastContext = useContext(ToastContext);

  onMount(async () => {
    try {
      const response = await fetch(`${baseUrl}/fleet/get/${hash}/${slug}`);
      const data = (await response.json()) as FleetSavedDataType | undefined;
      if (!data) return;

      await loadingPromise;
      const fleetData = getFleetData(data);
      setNewData(fleetData);
      setSaved(() => true);
      toastContext.createToast({
        id: "success-loading-data",
        type: "success",
        title: "Fleet data loaded",
        description: `${fleetData.name}`,
      });
    } catch {
      toastContext.createToast({
        id: "error-loading-data",
        type: "error",
        title: "Loading fleet data",
        description: "Network error.",
      });
    }
  });

  const exportFleet = () => {
    const fleetStr = fleetDataToString();
    if (!fleetStr)
      return toastContext.createToast({
        id: "error-exporting-data",
        type: "error",
        title: "Export fleet data",
        description: "Save your fleet, reload page and retry.",
      });
    const a = document.createElement("a");
    a.download = "fleet_data.json";
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(fleetStr);
    a.click();
    toastContext.createToast({
      id: "success-loading-data",
      type: "success",
      title: "Export fleet data",
      description: "Verify your download folder.",
    });
  };

  const [cardsCollapse, { toggle: toggleCardsCollapse }] = useCardsCollapse();

  const toggleIcon = (
    <IconButton
      iconID={cardsCollapse() ? "expand-arrows-alt" : "compress-arrows-alt"}
      title={cardsCollapse() ? "Expand cards" : "Compress cards"}
      onClick={toggleCardsCollapse}
    />
  );

  const showCrew = (ship: ShipType) => {
    const _ship = () => ship;
    const oldState = JSON.stringify(_ship().crew);
    modalContext.showModal({
      id: "add_crew_" + objectId(_ship()).toString(),
      title: "Crew manager",
      subtitle: _ship().fullname,
      onClose: () => {
        const newState = JSON.stringify(ship.crew);
        if (!onlyDisplay && oldState !== newState) {
          setSaved(() => false);
        }
      },
      content: createRoot(() => (
        <Crew
          ship={_ship()}
          remainingFleetPoints={fleetData.points.max - fleetData.points.current}
        />
      )),
    });
  };

  const showEquipment = (ship: ShipType) => {
    const _ship = () => ship;
    const oldState = JSON.stringify(_ship().equipment);
    modalContext.showModal({
      id: "add_equipment_" + objectId(_ship()).toString(),
      title: "Equipment manager",
      subtitle: _ship().fullname,
      onClose: () => {
        const newState = JSON.stringify(ship.equipment);
        if (!onlyDisplay && oldState !== newState) {
          setSaved(() => false);
        }
      },
      content: createRoot(() => (
        <Equipment
          ship={_ship()}
          remainingFleetPoints={fleetData.points.max - fleetData.points.current}
        />
      )),
    });
  };

  const showTreasures = (
    <IconButton
      iconID="treasure-chest"
      onClick={() => {
        const oldState = JSON.stringify(fleetData.treasures);

        modalContext.showModal({
          id: "add_treasure",
          title: "Treasure manager",
          onClose: () => {
            const newState = JSON.stringify(fleetData.treasures);
            if (!onlyDisplay && oldState !== newState) {
              setSaved(() => false);
            }
          },
          content: createRoot(() => (
            <Treasure
              treasures={fleetData.treasures}
              remainingFleetPoints={
                fleetData.points.max - fleetData.points.current
              }
            />
          )),
        });
      }}
      data-treasures-count={
        fleetData.treasures.length ? fleetData.treasures.length : null
      }
      title="Add treasure"
    />
  );

  const copyFleet = (
    <IconButton
      iconID="clipboard"
      onClick={() => {
        const newLine = "\n";
        modalContext.showModal({
          id: "copy_fleet",
          title: "Copy fleet as text",
          content: createRoot(() => (
            <Input
              type="textarea"
              ref={(ref) => {
                setTimeout(async () => {
                  ref.focus();
                  ref.select();
                  await navigator.clipboard.writeText(ref.innerHTML);
                  toastContext.createToast({
                    id: "success-write-clipboard",
                    title: "Copied fleet data",
                    type: "success",
                    description: "",
                  });
                }, 150);
              }}
            >
              {fleetData.ships.reduce(
                (output, ship) =>
                  `${output}(${ship.points}p) ${ship.name} #${ship.extension.short}${ship.numid} - ${ship.faction.defaultname}${newLine}` +
                  `${ship.crew.reduce(
                    (output, crew) =>
                      `${output}  (${crew.points}p) ${crew.name} #${crew.extension.short}${crew.numid} - ${crew.faction.defaultname}${newLine}`,
                    ""
                  )}` +
                  `${ship.equipment.reduce(
                    (output, equipment) =>
                      `${output}  (${equipment.points}p) ${equipment.name} #${equipment.extension.short}${equipment.numid}${newLine}`,
                    ""
                  )}` +
                  newLine,
                `[${fleetData.name}](${location.href.replace(
                  "/self",
                  ""
                )})${newLine}${newLine}${
                  fleetData.description
                    ? `${fleetData.description}${newLine}${newLine}`
                    : ""
                }`
              )}
            </Input>
          )),
        });
      }}
      title="Copy as text"
    />
  );

  const shareFleet = (
    <Show when={"clipboard" in navigator || "share" in navigator}>
      <IconButton
        iconID="share-nodes"
        onClick={() => {
          const url = location.href.replace("/self", "");

          const timeout = setTimeout(() => {
            toastContext.createToast({
              id: "error-sharing",
              type: "error",
              title: "Share my fleet",
              description: "Impossible to share, please copy the browser URL.",
            });
          }, 2000);

          if (typeof navigator.share === "function") {
            clearTimeout(timeout);
            return navigator.share({
              title: fleetData.name,
              text: "Take a look at my awesome fleet!",
              url,
            });
          }

          if (typeof navigator.clipboard !== "undefined") {
            void navigator.clipboard.writeText(url).then(() => {
              clearTimeout(timeout);
              toastContext.createToast({
                id: "success-clearing",
                type: "success",
                title: "Share my fleet",
                description: "Link copied to clipboard.",
              });
            });
          }
        }}
        title="Share your fleet"
      />
    </Show>
  );

  let displayContainer: HTMLDivElement | undefined;
  let removeShipAction: (ship: ShipType) => JSX.Element = () => <></>;
  const fleetActions: JSX.Element[] = [];
  const settingsActions: JSX.Element = [];

  if (!onlyDisplay) {
    const shipItemsContext = useContext(ShipItemsContext);

    const addShip = (ship: ShipType) => {
      const _ship = () => ship;
      if (fleetData.ships.some((ship) => ship.name === _ship().name)) {
        toastContext.createToast({
          id: "warning-adding-same-ships",
          type: "warning",
          title: "Add ship",
          description: "Ships with the same name.",
        });
      }
      if (fleetData.points.current + _ship().points > fleetData.points.max) {
        toastContext.createToast({
          id: "warning-exceeding-maxpoints",
          type: "warning",
          title: "Add ship",
          description: (
            <>
              Exceeding fleet max points.
              <br />
              <small>You can increase it in settings.</small>
            </>
          ),
        });
      }
      setData(
        produce((data) => {
          data.ships.push({ ...ship, crew: [] });
        })
      );
      setSaved(() => false);
    };

    const removeShip = (ship: ShipType) => {
      const shipIndex = fleetData.ships.findIndex((_ship) => ship === _ship);
      if (shipIndex >= 0) {
        setNewData((data) => {
          data.ships.splice(shipIndex, 1);
        });
      }
    };

    removeShipAction = (ship: ShipType) => (
      <IconButton
        iconID="trash-can"
        onClick={() => removeShip(ship)}
        title="Remove ship"
      />
    );

    shipItemsContext.add = addShip;

    const importFleet = () => {
      const inputFile = document.createElement("input");
      inputFile.type = "file";
      inputFile.accept = "application/json";
      inputFile.addEventListener("change", async () => {
        if (!inputFile.files?.item(0)) {
          return toastContext.createToast({
            id: "error-import-missing-file",
            type: "error",
            title: "Import fleet data",
            description: "No file provided.",
          });
        }
        const file = inputFile.files.item(0);
        if (file?.type !== "application/json") {
          return toastContext.createToast({
            id: "error-import-wrong-file-format",
            type: "warning",
            title: "Import fleet data",
            description: "Please provide a valid file (.json)",
          });
        }
        try {
          const fileFleetData = getFleetData(
            JSON.parse(await file.text()) as FleetSavedDataType
          );
          setNewData(fileFleetData);
          setSaved(() => false);
          return toastContext.createToast({
            id: "success-importing-data",
            type: "success",
            title: "Import fleet data",
            description: `Loaded from ${fleetData.name} (not saved).`,
          });
        } catch {
          toastContext.createToast({
            id: "error-importing-data",
            type: "error",
            title: "Import fleet data",
            description: "Please verify the imported file and try again.",
          });
        }
      });
      inputFile.click();
    };

    const saveFleet = async () => {
      const fleetStr = fleetDataToString();
      return fetchWithTimeout(`${baseUrl}/fleet/self/set/${hash}/${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: fleetStr,
      }).then(async (res) => {
        if (res.ok) {
          setSaved(() => true);
          return toastContext.createToast({
            id: "success-saving-data",
            type: "success",
            title: "Save fleet data",
            description: "",
          });
        }
        switch (res.status) {
          case 400: {
            let messages: string[] | undefined;
            try {
              messages = JSON.parse(await res.text()) as string[];
            } catch {
              //
            }

            if (!Array.isArray(messages) || messages.length === 0) {
              messages = ["Invalid fleet data."];
            }

            for (const message of messages) {
              toastContext.createToast({
                id:
                  "error-saving-data-" +
                  // trying to create different id for each error message
                  message.split(" ").slice(0, 2).join("-").toLocaleLowerCase(),
                type: "error",
                title: "Save fleet data",
                description: message,
              });
            }
            break;
          }
          case 408:
            toastContext.createToast({
              id: "error-saving-data-network",
              type: "error",
              title: "Save fleet data",
              description: "Network error.",
            });
            break;
          default:
            toastContext.createToast({
              id: "error-saving-data-unknown",
              type: "error",
              title: "Save fleet data",
              description: "Internal error. Please contact administrators.",
            });
        }
      });
    };

    const clearFleet = () => {
      modalContext.showModal({
        id: "clear-fleet-confirmation",
        title: "Are you willing to clear all items in your fleet?",
        onClose: false,
        content: createRoot(() => (
          <div style={{ "text-align": "center", flex: "1" }}>
            <IconButton
              iconID="window-close"
              style={{
                "font-size": "3em",
              }}
              onClick={() =>
                modalContext.closeModal("clear-fleet-confirmation")
              }
            />
            <IconButton
              iconID="check-square"
              style={{
                "font-size": "3em",
              }}
              onClick={() => {
                toastContext.createToast({
                  id: "info-clearing",
                  type: "info",
                  title: "Clear fleet items",
                  description: "Removed all items from your fleet (not saved).",
                });
                setNewData((data) => {
                  data.ships.length = 0;
                });
                modalContext.closeModal("clear-fleet-confirmation");
              }}
            />
          </div>
        )),
      });
    };

    const editFleetSettings = () => {
      modalContext.showModal({
        id: "edit_fleet_settings",
        title: "Fleet settings",
        content: createRoot(() => (
          <Settings
            saved={saved()}
            data={{
              name: {
                name: "Fleet name",
                type: "text",
                value: fleetData.name,
                maxlength: window.fleetNameMaxlength,
                minlength: window.fleetNameMinlength,
              },
              maxpoints: {
                name: "Max points",
                type: "number",
                value: fleetData.points.max,
                min: window.fleetMaxpointsMin,
                max: window.fleetMaxpointsMax,
              },
              ispublic: {
                name: "Public",
                type: "checkbox",
                checked: fleetData.ispublic,
              },
              description: {
                name: "Description",
                type: "textarea",
                value: fleetData.description,
              },
            }}
            onInput={(data) => {
              setNewData((_data) => {
                _data.name = data.name.value as string;
                // @ts-expect-error checked should appear in input props
                _data.ispublic = !!data.ispublic.checked;
                _data.points.max = data.maxpoints.value as number;
                _data.description = data.description.value as string;
              });
            }}
            onSave={saveFleet}
          />
        )),
      });
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

    fleetActions.push(
      <IconButton
        iconID="search-plus"
        onClick={scrollToDisplayBottom}
        class="scroll_to_search"
        primary
      >
        Add ships
      </IconButton>,
      showTreasures,
      toggleIcon,
      copyFleet,
      <IconButton
        iconID="save"
        onClick={saveFleet}
        title="Save"
        data-unsaved={!saved() ? "" : null}
      />,
      shareFleet,
      <IconButton
        iconID="download"
        onClick={exportFleet}
        title="Export to file"
      />,
      <IconButton
        iconID="cloud-upload"
        onClick={importFleet}
        title="Import from file"
      />,
      <IconButton iconID="eraser" onClick={clearFleet} title="Clear fleet" />
    );
    settingsActions.push(
      <IconButton
        iconID="cog"
        class="settings"
        onClick={editFleetSettings}
        title="Edit fleet settings"
      />
    );
  } else {
    fleetActions.push(
      toggleIcon,
      showTreasures,
      copyFleet,
      shareFleet,
      <IconButton
        iconID="share-square"
        class="export"
        onClick={exportFleet}
        title="Export to file"
      />
    );
  }

  const fleet = (
    <Show
      when={fleetData.ships.length}
      fallback={
        <h3 class="items_info">
          No selected ship, click on <Icon iconID="search-plus" /> to start.
        </h3>
      }
    >
      <Items
        classList={{
          minimized: cardsCollapse(),
          maximized: !cardsCollapse(),
        }}
      >
        <For each={fleetData.ships}>
          {(ship) => (
            <ShipItem
              data={ship}
              actions={
                <>
                  <IconButton
                    onClick={() => showCrew(ship)}
                    data-crew-room={ship.crew.length ? ship.crew.length : null}
                    iconID="users-cog"
                    title="Show crew"
                  />
                  <IconButton
                    onClick={() => showEquipment(ship)}
                    data-equipments-room={
                      ship.equipment.length ? ship.equipment.length : null
                    }
                    iconID="dolly-box"
                    title="Show equipment"
                  />
                  {removeShipAction(ship)}
                </>
              }
            />
          )}
        </For>
      </Items>
    </Show>
  );

  return (
    <Display
      ref={(ref) => (displayContainer = ref)}
      header={
        <>
          <h2 class="title">{fleetData.name}</h2>
          <span class="points">
            <i class="fas fa-coins" />
            &nbsp;&nbsp;{fleetData.points.current}&nbsp;/&nbsp;
            {fleetData.points.max}
          </span>
          {settingsActions.length && (
            <span class="settings">{settingsActions}</span>
          )}
        </>
      }
      actions={
        <>
          {fleetActions}
          <Show when={onlyDisplay && fleetData.description}>
            <div class="description whitebox">
              <textarea
                readonly
                ref={(ref) => {
                  setTimeout(() => {
                    ref.style.height = ref.scrollHeight.toString() + "px";
                  });
                }}
              >
                {fleetData.description}
              </textarea>
            </div>
          </Show>
        </>
      }
      items={fleet}
    />
  );
};

export default FleetDisplay;
