import { useCallback, useContext, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { shipDict, ShipItemsContext, ShipItemType } from "..";
import { onlyDisplay } from "../../../app";
import { removeItemFromArray, useEffectOnce } from "../../../utils";
import Display from "../../commons/Display";
import IconButton from "../../commons/IconButton";
import { ModalContext } from "../../commons/Modal";
import Settings, { DataType } from "../../commons/Settings";
import { ToastContext } from "../../commons/Toasts";
import Crew, { crewDict, CrewItemType } from "../../Crew";
import ShipItem from "../ShipItem";
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
console.log(hash, slug);


async function getSavedFleetData() {
    try {
        const response = await fetch(`/public/fleet/get/${hash}/${slug}`);
        // const response = await fetch("http://psmlist/public/fleet/my-fleet-0");
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
    

    const [fleetData, setData] = useState<FleetDataType>(() => defaultFleetData);

    fleetData.points.current = fleetData.ships.reduce(
        (shipTotal: number, ship: ShipItemType) =>
            shipTotal
            +
            ship.crew.reduce((crewTotal: number, crew: CrewItemType) => crewTotal + crew.points, ship.points),
        0
    );

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

    useEffectOnce(() => {

        (async () => {
            const savedFleetData = await getSavedFleetData();
            if (savedFleetData) {
                setData(() => savedFleetData);
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
                    description: 'Failed to load cached fleet data. Please try again later.'
                });
            }
        })()
    });

    const exportFleet = useCallback(() => {
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
    }, []);

    const showCrew = (ship: ShipItemType) => {
        modalContext.showModal({
            id: 'add_crew_' + ship.id,
            title: 'Select crew for ' + ship.fullname,
            onClose: () => {
                setData(() => ({
                    ...fleetData
                }));
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
            fleetData.ships.push(ship);
            setData(() => ({
                ...fleetData
            }));
        }

        const removeShip = (ship: ShipItemType) => {
            if (removeItemFromArray(fleetData.ships, _ship => ship.id === _ship.id)) {
                setData(() => ({
                    ...fleetData
                }));
            }
        }
        
        removeShipAction = (ship: ShipItemType) => <IconButton iconID="minus-square" onClick={() => removeShip(ship)} />

        useEffectOnce(() => {
            shipItemsContext.selectItemCallbacks.push(addShip);

            return () => {
                removeItemFromArray(shipItemsContext.selectItemCallbacks, func => func === addShip);
            }
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
                        setData(() => fileFleetData);
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
            fleetData.ships.length = 0;
            setData(() => ({
                ...fleetData
            }));
        }

        const editFleetSettings = () => {
            modalContext.showModal({
                id: 'edit_fleet_settings',
                title: 'Fleet settings',
                onClose: () => {
                },
                inside:
                    <Settings
                        defaultData={{
                            public: defaultFleetData.ispublic,
                            points: {
                                max: defaultFleetData.points.max
                            },
                            name: defaultFleetData.name
                        }}
                        data={{
                            public: fleetData.ispublic,
                            points: {
                                max: fleetData.points.max
                            },
                            name: fleetData.name
                        }}
                        onChange={(newData) => {
                            fleetData.name = newData.name as string;
                            fleetData.points.max = (newData.points as DataType).max as number;
                            fleetData.ispublic = newData.public as boolean;
                            setData(() => {
                                setTimeout(() => saveFleet(), 1);
                                return {
                                    ...fleetData
                                };
                            });
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

    const fleet =
        fleetData.ships.map(ship =>
            <ShipItem
                data={
                    ship
                }
                actions={
                    <>
                        <IconButton
                            onClick={() => showCrew(ship)}
                            data-crew-room={ship.crew.length ? ship.crew.length : null}
                            iconID="users-cog"
                        />
                        { removeShipAction && removeShipAction(ship) }
                    </>
                }
            />
        );

    return (
        <Display
            title={
                fleetData.name
            }
            info={
                headerInfo
            }
            actions={
                fleetActions
            }
            items={
                fleet
            }
        />
    );
}

export default FleetDisplay;