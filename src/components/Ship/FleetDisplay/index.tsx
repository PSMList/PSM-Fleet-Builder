import { hash, onlyDisplay, slug } from "@/App";
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
import { fetchWithTimeout } from "@/utils";
import { createEffect, createSignal, For, JSX, useContext } from "solid-js";
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
    description: string
}

export type FleetDataType = {
    name: string
    points: {
        current: number
        max: number
    }
    ispublic: boolean
    ships: ShipType[]
    description: string
}

const defaultFleetData: FleetDataType = {
    name: 'My fleet',
    points: {
        current: 0,
        max: 40
    },
    ships: [],
    ispublic: false,
    description: ''
}

const FleetDisplay = () => {
    const { database, loadingPromise } = useStore().databaseService;

    const [fleetData, setData] = createStore<FleetDataType>(defaultFleetData);

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
                const ship = { ...database.ships.get(shipID)!, uuid: Math.random().toString().substring(2) };
                ship.crew = crews.map((crew: { id: number }) => ({ ...database.crews.get(crew.id)! }));
                return ship;
            }),
            ispublic: savedData.ispublic,
            description: savedData.description
        };
    }

    async function getSavedFleetData() {
        try {
            const response = await fetch(`${window.baseUrl}/fleet/get/${hash}/${slug}`);
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

    const [ saved, setSaved ] = createSignal(true);

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
            (shipTotal: number, ship: ShipType) =>
                shipTotal
                +
                ship.crew.reduce((crewTotal: number, crew: CrewType) => crewTotal + crew.points, ship.points),
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
                ispublic: fleetData.ispublic,
                description: fleetData.description
            }
            return JSON.stringify(data);
        }
        catch { }
    }

    const modalContext = useContext(ModalContext);
    const toastContext = useContext(ToastContext);

    (async () => {
        await loadingPromise;
        const savedFleetData = await getSavedFleetData();
        if (savedFleetData) {
            setNewData(savedFleetData);
            toastContext.createToast({
                id: 'success-loading-data',
                type: 'info',
                title: 'Load saved fleet data',
                description: `${savedFleetData.name}.`
            });
        }
        else {
            toastContext.createToast({
                id: 'error-loading-data',
                type: 'error',
                title: 'Load saved fleet data',
                description: 'Verify your connection, reload the page and retry.'
            });
        }
    })();

    const exportFleet = () => {
        const fleetStr = fleetDataToString();
        if (!fleetStr) return toastContext.createToast({
            id: 'error-exporting-data',
            type: 'error',
            title: 'Export fleet data',
            description: 'Save your fleet, reload page and retry.'
        });
        const a = document.createElement('a');
        a.download = 'fleet_data.json';
        a.href = "data:text/json;charset=utf-8," + encodeURIComponent(fleetStr);
        a.click();
        toastContext.createToast({
            id: 'success-loading-data',
            type: 'success',
            title: 'Export fleet data',
            description: 'Verify your download folder.'
        });
    };

    const showCrew = (ship: ShipType) => {
        const oldState = JSON.stringify(ship.crew);
        modalContext.showModal({
            id: 'add_crew_' + ship.uuid,
            title: 'Select crew for ' + ship.fullname,
            onClose: () => {
                const newState = JSON.stringify(ship.crew);
                if (!onlyDisplay && oldState !== newState) {
                    setSaved(() => false);
                }
            },
            content: () =>
                <Crew
                    ship={ship}
                    remainingFleetPoints={fleetData.points.max - fleetData.points.current}
                />
        });
    }

    let displayContainer: HTMLDivElement;
    let removeShipAction: (ship: ShipType) => JSX.Element | undefined;
    let fleetActions: JSX.Element | undefined;
    let settingsAction: JSX.Element | undefined;

    if (!onlyDisplay) {

        const shipItemsContext = useContext(ShipItemsContext);

        const addShip = (ship: ShipType) => {
            if (fleetData.ships.some(_ship => _ship.name === ship.name)) toastContext.createToast({
                id: 'warning-adding-same-ships',
                type: 'warning',
                title: 'Add ship',
                description: 'Ships with the same name.'
            });
            if (fleetData.points.current + ship.points > fleetData.points.max) toastContext.createToast({
                id: 'warning-exceeding-maxpoints',
                type: 'warning',
                title: 'Add ship',
                description: <>
                    Exceeding fleet max points.
                    <br/>
                    <small>You can increase it in settings.</small>
                </>
            });
            setData(produce(data => {
                data.ships.push({ ...ship, crew: [], uuid: Math.random().toString().substring(2) });
            }));
            setSaved(() => false);
        }

        const removeShip = (ship: ShipType) => {
            const shipIndex = fleetData.ships.reverse().findIndex(_ship => ship === _ship);
            if (shipIndex >= 0) {
                setData(produce((data) => {
                    data.ships.splice(shipIndex, 1);
                }));
                setSaved(() => false);
            }
        }

        removeShipAction = (ship: ShipType) =>
            <IconButton
                iconID="minus-square"
                onClick={() => removeShip(ship)}
                title="Remove ship"
            />

        shipItemsContext.add = addShip;

        const importFleet = () => {
            const inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = 'application/json';
            inputFile.addEventListener('change', async () => {
                if (!inputFile.files || !inputFile.files.item(0)) {
                    return toastContext.createToast({
                        id: 'error-importing-no-file',
                        type: 'error',
                        title: 'Import fleet data',
                        description: 'No file provided.'
                    });
                }
                const file = inputFile.files.item(0);
                if (file?.type !== 'application/json') {
                    return toastContext.createToast({
                        id: 'error-import-wrong-file-format',
                        type: 'warning',
                        title: 'Import fleet data',
                        description: 'Please provide a valid file (.json)'
                    });
                }
                try {
                    const fileFleetData = getFleetData(JSON.parse(await file.text()));
                    if (fileFleetData) {
                        setNewData(fileFleetData);
                        setSaved(() => false);
                        return toastContext.createToast({
                            id: 'success-importing-data',
                            type: 'success',
                            title: 'Import fleet data',
                            description: `Loaded from ${fleetData.name} (not saved).`
                        });
                    }
                }
                catch {
                    toastContext.createToast({
                        id: 'error-importing-data',
                        type: 'error',
                        title: 'Import fleet data',
                        description: 'Please verify the imported file and try again.'
                    });
                }
            });
            inputFile.click();
        }

        const saveFleet = async () => {
            const fleetStr = fleetDataToString();
            fetchWithTimeout(`${window.baseUrl}/fleet/self/set/${hash}/${slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: fleetStr
            })
                .then(async res => {
                    if (res.ok) {
                        setSaved(() => true);
                        toastContext.createToast({
                            id: 'success-saving-data',
                            type: 'success',
                            title: 'Save fleet data',
                            description: ''
                        });
                    }
                    else {
                        switch (res.status) {
                            case 400:
                                let description;
                                try { description = JSON.parse(await res.text()); } catch { }

                                if (typeof description !== 'string') {
                                    description = 'Invalid fleet data.';
                                }

                                toastContext.createToast({
                                    id: 'error-saving-data',
                                    type: 'error',
                                    title: 'Save fleet data',
                                    description
                                });
                            case 408:
                                toastContext.createToast({
                                    id: 'error-saving-data',
                                    type: 'error',
                                    title: 'Save fleet data',
                                    description: 'Request timeout.'
                                });
                            case 401:
                                toastContext.createToast({
                                    id: 'error-saving-data',
                                    type: 'error',
                                    title: 'Save fleet data',
                                    description: 'Verify that your are on PSMList.com.'
                                });
                            default:
                                toastContext.createToast({
                                    id: 'error-saving-data',
                                    type: 'error',
                                    title: 'Save fleet data',
                                    description: 'Internal error. Please contact administrators.'
                                });
                        }
                    }
                });
        }

        const clearFleet = () => {
            toastContext.createToast({
                id: 'info-clearing',
                type: 'info',
                title: 'Clear ships',
                description: 'Removed ships data (not saved).'
            });
            setData(produce(data => {
                data.ships.length = 0;
            }));
            setSaved(() => false);
        }

        const editFleetSettings = () => {
            modalContext.showModal({
                id: 'edit_fleet_settings',
                title: 'Fleet settings',
                onClose() {},
                content: () =>
                    <Settings
                        data={{
                            name: {
                                name: "Fleet name",
                                type: "text",
                                value: fleetData.name,
                                minlength: window.fleetNameMinlength,
                                maxlength: window.fleetNameMaxlength
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
                        onSave={data => {
                            setNewData({
                                name: data.name.value as string,
                                ispublic: data.ispublic.checked as boolean,
                                points: {
                                    max: data.maxpoints.value as number,
                                    current: fleetData.points.current
                                },
                                ships: fleetData.ships,
                                description: fleetData.description
                            });
                            setSaved(() => false);
                            setTimeout(saveFleet, 500);
                        }}
                    />
            });
        }

        const scrollToDisplayBottom = () => {
            if (displayContainer) {
                const scrollElement = document.body.parentElement!;
                scrollElement.scrollTo({
                    top: scrollElement.scrollTop + displayContainer.getBoundingClientRect().top + displayContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }

        fleetActions = (
            <>
                <IconButton
                    iconID="search-plus"
                    onClick={scrollToDisplayBottom}
                    class="scroll_to_search"
                />
                <IconButton
                    iconID="save"
                    onClick={saveFleet}
                    title="Save"
                    style={{ color: saved() ? "green" : "red" }}
                />
                <IconButton
                    iconID="share-square"
                    onClick={exportFleet}
                    title="Export to file"
                />
                <IconButton
                    iconID="file-import"
                    onClick={importFleet}
                    title="Import from file"
                />
                <IconButton
                    iconID="eraser"
                    onClick={clearFleet}
                    title="Clear fleet"
                />
            </>
        );
        settingsAction = 
            <IconButton
                iconID="cog"
                class="settings"
                onClick={editFleetSettings}
                title="Edit fleet settings"
            />
    }

    const headerInfo = <>
        <span class="points">
            <i class="fas fa-coins" />&nbsp;&nbsp;{fleetData.points.current}&nbsp;/&nbsp;{fleetData.points.max}
        </span>
        { settingsAction }
    </>

    if (!fleetActions) {
        fleetActions = (
            <IconButton
                iconID="share-square"
                class="export"
                onClick={exportFleet}
                title="Export to file"
            />
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
                                title="Show crew"
                            />
                            {removeShipAction && removeShipAction(ship)}
                        </>}
                    />
            }
        </For>
    );

    return (
        <Display
            ref={ (ref) => displayContainer = ref }
            title={fleetData.name}
            info={headerInfo}
            actions={fleetActions}
            items={fleet}
        />
    );
}

export default FleetDisplay;
