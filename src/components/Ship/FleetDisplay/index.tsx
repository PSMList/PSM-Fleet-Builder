import { onlyDisplay } from "@/App";
import Display from "@/components/commons/Display";
import IconButton from "@/components/commons/IconButton";
import { ModalContext } from "@/components/commons/Modal";
import Settings from "@/components/commons/Settings";
import { ToastContext } from "@/components/commons/Toasts";
import Crew, { crewDict, CrewItemType } from "@/components/Crew";
import { shipDict, ShipItemsContext, ShipItemType } from "@/components/Ship";
import ShipItem from "@/components/Ship/ShipItem";
import { removeItemFromArray } from "@/utils";
import { createEffect, For, JSX, onCleanup, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import './FleetDisplay.css';


type FleetSavedDataType = {
    name: string
    maxpoints: number
    data: {
        id: number,
        crew: { id: number }[]
    }[]
    ispublic: boolean
}

export type FleetDataType = {
    name: string
    points: {
        current: number
        max: number
    }
    ispublic: boolean
    ships: ShipItemType[]
}

const defaultFleetData: FleetDataType = {
    name: 'My fleet',
    points: {
        current: 0,
        max: 40
    },
    ships: [],
    ispublic: false
}

function getFleetData(savedData: FleetSavedDataType): FleetDataType | undefined {
    // if ( !fleetDataSchema.test(stringData) ) return;

    return {
        name: savedData.name,
        points: {
            current: 0,
            max: savedData.maxpoints
        },
        ships: savedData.data.map((item: any) => {
            const { id: shipID, crew: crews } = item;
            const ship = { ...shipDict[shipID] };
            ship.crew = crews.map((crew: { id: number }) => ({ ...crewDict[crew.id] }));
            return ship;
        }),
        ispublic: savedData.ispublic
    };
}

const [hash, slug] = window.location.pathname.split('/').splice(-2, 2);

async function getSavedFleetData() {
    try {
        const response = await fetch(`/public/fleet/get/${hash}/${slug}`);
        // const response = await fetch(`http://psmlist/public/fleet/get/${hash}/${slug}`);
        const data = await response.json();

        if (!data) return;

        const fleetData = getFleetData(data);
        if (!fleetData) return;
        return fleetData;
    }
    catch (err) {
        console.error(err);
    }
}

const FleetDisplay = () => {
    const [fleetData, setData] = createStore<FleetDataType>(defaultFleetData);

    const setNewData = (newData: FleetDataType) => {
        setData(produce(data => {
            data.ispublic = newData.ispublic;
            data.name = newData.name;
            data.points = newData.points;
            data.ships = newData.ships;
        }));
    }

    createEffect(() => {
        setData("points", "current", fleetData.ships.reduce(
            (shipTotal: number, ship: ShipItemType) =>
                shipTotal
                +
                ship.crew.reduce((crewTotal: number, crew: CrewItemType) => crewTotal + crew.points, ship.points),
            0
        ));
    });

    const fleetDataToString = (): string | undefined => {
        try {
            const data: FleetSavedDataType = {
                name: fleetData.name,
                maxpoints: fleetData.points.max,
                data: fleetData.ships.map(ship => ({
                    id: ship.id,
                    crew: ship.crew.map(crew => ({
                        id: crew.id
                    }))
                })),
                ispublic: fleetData.ispublic
            }
            return JSON.stringify(data);
        }
        catch { }
    }

    const modalContext = useContext(ModalContext);
    const toastContext = useContext(ToastContext);

    (async () => {
        const savedFleetData = await getSavedFleetData();
        if (savedFleetData) {
            setNewData(savedFleetData);
            toastContext.createToast({
                type: 'info',
                title: 'Load saved fleet data',
                description: `Successfully loaded fleet data from ${savedFleetData.name}.`
            });
        }
        else {
            toastContext.createToast({
                type: 'error',
                title: 'Load saved fleet data',
                description: 'Failed to load fleet data. Please try again later.'
            });
        }
    })();

    const exportFleet = () => {
        const fleetStr = fleetDataToString();
        if (!fleetStr) return toastContext.createToast({
            type: 'error',
            title: 'Export fleet data',
            description: 'Fleet data not exported. Please try again later.'
        });
        const a = document.createElement('a');
        a.download = 'fleet_data.json';
        a.href = "data:text/json;charset=utf-8," + encodeURIComponent(fleetStr);
        a.click();
        toastContext.createToast({
            type: 'success',
            title: 'Export fleet data',
            description: 'Fleet data exported in your download folder.'
        });
    };

    const showCrew = (ship: ShipItemType) => {
        modalContext.showModal({
            id: 'add_crew_' + ship.id,
            title: 'Select crew for ' + ship.fullname,
            onClose: () => {
            },
            inside: <Crew ship={ship} remainingFleetPoints={fleetData.points.max - fleetData.points.current} />
        });
    }

    let removeShipAction: (ship: ShipItemType) => JSX.Element | undefined;
    let fleetActions: JSX.Element | undefined;

    if (!onlyDisplay) {

        const shipItemsContext = useContext(ShipItemsContext);

        const addShip = (ship: ShipItemType) => {
            if (fleetData.ships.some(_ship => _ship.name === ship.name)) toastContext.createToast({
                type: 'warning',
                title: 'Add ship',
                description: 'You happen to have picked two or more ships with an identical name. Please check if this what you really want to do before saving.'
            });
            if (fleetData.points.current + ship.points > fleetData.points.max) toastContext.createToast({
                type: 'warning',
                title: 'Add ship',
                description: 'Exceeding fleet max points. Please go to the settings if you want to increase the limit.'
            });
            setData(produce(data => {
                data.ships.push({ ...ship });
            }));
        }

        const removeShip = (ship: ShipItemType) => {
            const shipIndex = fleetData.ships.findIndex(_ship => ship === _ship);
            if (shipIndex >= 0) {
                setData(produce((data) => {
                    data.ships.splice(shipIndex, 1);
                }));
            }
        }

        removeShipAction = (ship: ShipItemType) => <IconButton iconID="minus-square" onClick={() => removeShip(ship)} />

        shipItemsContext.selectItemCallbacks.push(addShip);
        onCleanup(() => {
            removeItemFromArray(shipItemsContext.selectItemCallbacks, func => func === addShip);
        });

        const importFleet = () => {
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = 'application/json';
            inputFile.addEventListener('change', async () => {
                if (!inputFile.files || !inputFile.files.item(0)) {
                    return toastContext.createToast({
                        type: 'warning',
                        title: 'Import fleet data',
                        description: 'No file provided.'
                    });
                }
                const file = inputFile.files.item(0);
                if (file?.type !== 'application/json') {
                    return toastContext.createToast({
                        type: 'warning',
                        title: 'Import fleet data',
                        description: 'Provided file is not a valid .json file. Please provide a valid one.'
                    });
                }
                try {
                    const fileFleetData = getFleetData(JSON.parse(await file.text()));
                    if (fileFleetData) {
                        setNewData(fileFleetData);
                        return toastContext.createToast({
                            type: 'success',
                            title: 'Import fleet data',
                            description: `Successfully loaded fleet data from ${fleetData.name} (not saved).`
                        });
                    }
                }
                catch { }
                toastContext.createToast({
                    type: 'error',
                    title: 'Import fleet data',
                    description: 'Fleet data not imported. Please try again later.'
                });
            });
            inputFile.click();
        }

        const saveFleet = async () => {
            const fleetStr = fleetDataToString();
            fetch(`/public/fleet/self/set/${hash}/${slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: fleetStr
            })
                .then((res) => {
                    if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
                    toastContext.createToast({
                        type: 'success',
                        title: 'Save fleet data',
                        description: 'Fleet data successfully saved.'
                    });
                })
                .catch(() => {
                    toastContext.createToast({
                        type: 'error',
                        title: 'Save fleet data',
                        description: 'Fleet data not saved. Please try again later.'
                    });
                });
        }

        const clearFleet = () => {
            toastContext.createToast({
                type: 'info',
                title: 'Clear ships',
                description: 'Removed ships data (not saved).'
            });
            setData(produce(data => {
                data.ships.length = 0;
            }));
        }

        const editFleetSettings = () => {
            modalContext.showModal({
                id: 'edit_fleet_settings',
                title: 'Fleet settings',
                inside:
                    <Settings
                        data={{
                            name: {
                                name: "Fleet name",
                                type: "text",
                                value: fleetData.name,
                                minlength: 5
                            },
                            maxpoints: {
                                name: "Max points",
                                type: "number",
                                value: fleetData.points.max,
                                // @ts-expect-error just ignore
                                min: fleetMaxpointsMin,
                                // @ts-expect-error just ignore
                                max: fleetMaxpointsMax,
                            },
                            ispublic: {
                                name: "Public",
                                type: "checkbox",
                                checked: fleetData.ispublic,
                            },
                        }}
                        onSave={data => {
                            setNewData({
                                name: data.name.value as string,
                                ispublic: data.ispublic.checked as boolean,
                                points: {
                                    max: data.maxpoints.value as number,
                                    current: fleetData.points.current
                                },
                                ships: fleetData.ships
                            });
                            setTimeout(saveFleet, 500);
                        }}
                    />
            });
        }

        fleetActions = (
            <>
                <IconButton iconID="share-square" class="export" onClick={exportFleet} title="Export to file" />
                <IconButton iconID="file-import" class="import" onClick={importFleet} title="Import from file" />
                <IconButton iconID="save" class="save" onClick={saveFleet} title="Save" />
                <IconButton iconID="eraser" class="clear" onClick={clearFleet} title="Clear fleet" />
                <IconButton iconID="cog" class="settings" onClick={editFleetSettings} title="Edit fleet settings" />
            </>
        );
    }

    const headerInfo = (
        <span class="points">
            <i class="fas fa-coins" />&nbsp;&nbsp;{fleetData.points.current}&nbsp;/&nbsp;{fleetData.points.max}
        </span>
    );

    if (!fleetActions) {
        fleetActions = (
            <IconButton iconID="share-square" class="export" onClick={exportFleet} title="Export to file" />
        );
    }

    const fleet = (
        <For each={fleetData.ships}>
            {
                ship =>
                    <ShipItem
                        data={ship}
                        actions={<>
                            <IconButton
                                onClick={() => showCrew(ship)}
                                data-crew-room={ship.crew.length ? ship.crew.length : null}
                                iconID="users-cog"
                            />
                            {removeShipAction && removeShipAction(ship)}
                        </>}
                    />
            }
        </For>
    );

    return (
        <Display
            title={fleetData.name}
            info={headerInfo}
            actions={fleetActions}
            items={fleet}
        />
    );
}

export default FleetDisplay;
