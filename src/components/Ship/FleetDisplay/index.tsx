import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";
import { shipDict, ShipItemsContext, ShipItemType } from "..";
import { removeItemFromArray } from "../../../utils";
import Display from "../../commons/Display";
import IconButton from "../../commons/IconButton";
import { ModalContext } from "../../commons/Modal";
import Settings, { DataType } from "../../commons/Settings";
import { ToastContext } from "../../commons/Toasts";
import Crew, { crewDict, CrewItemType } from "../../Crew";
import { CrewSavedDataType } from "../../Crew/CrewDisplay";
import ShipItem from "../ShipItem";
import './FleetDisplay.css';


type FleetSavedDataType = {
    name: string
    points: {
        max: number
    }
    ships: {
        id: number,
        crew: CrewSavedDataType[]
    }[]
}

export type FleetDataType = {
    points: {
        current: number
    }
    ships: ShipItemType[]
} & FleetSavedDataType;

const defaultFleetData: FleetDataType = {
    name: 'My fleet',
    points: {
        current: 0,
        max: 40
    },
    ships: [],
}

function getFleetData(stringData: string): FleetDataType | undefined {
    // if ( !fleetDataSchema.test(stringData) ) return;

    const data: FleetSavedDataType = JSON.parse(stringData);

    return {
        name: data.name,
        points: {
            current: 0,
            max: data.points.max
        },
        ships: data.ships.map((item: any) => {
            const { id: shipID, crew: crewIDs } = item;
            const ship = { ...shipDict[shipID] };
            ship.crew = crewIDs.map((crewID: number) => ({ ...crewDict[crewID] }));
            return ship;
        })
    };
}

function getSavedFleetData() {
    const stringData = localStorage.getItem('fleet_data');

    if (!stringData) return;
    
    try {
        return getFleetData(stringData);
    }
    catch (err) {
        console.error(err);
    }
    alert('Failed to load saved data. Please clear browser cache.');
}

type ShipDisplayProps = {

}

const FleetDisplay = () => {

    const [fleetData, setData] = useState<FleetDataType>(getSavedFleetData() || defaultFleetData);

    fleetData.points.current = fleetData.ships.reduce(
        (shipTotal: number, ship: ShipItemType) =>
            shipTotal
            +
            ship.crew.reduce((crewTotal: number, crew: CrewItemType) => crewTotal + crew.points, ship.points),
        0
    );

    const shipItemsContext = useContext(ShipItemsContext);
    const modalContext = useContext(ModalContext);
    const toastContext = useContext(ToastContext);

    const addShip = (ship: ShipItemType) => {
        if (fleetData.points.current + ship.points > fleetData.points.max) return alert('/!\ Exceeding fleet max points. Double-click on the max points to edit it.');
        if (fleetData.ships.some(_ship => _ship.name === ship.name)) return alert('Ship with the same name already selected.');
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

    useEffect(() => {
        shipItemsContext.selectItemCallbacks.push(addShip);

        return () => {
            removeItemFromArray(shipItemsContext.selectItemCallbacks, func => func === addShip);
        }
    }, []);

    const fleetDataToString = () => {
        try {
            return JSON.stringify({
                name: fleetData.name,
                points: {
                    max: fleetData.points.max
                },
                ships: fleetData.ships.map(ship => ({
                    id: ship.id,
                    crew: ship.crew.map(crew =>
                        crew.id
                    )
                }))
            });
        }
        catch { }
    }

    const importFleet = () => {
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.addEventListener('change', async () => {
            if (!inputFile.files || !inputFile.files.item(0)) {
                return alert('No file provided.');
            }
            const file = inputFile.files.item(0);
            if (file?.type !== 'application/json') {
                return alert('Please provide a valid .json file.');
            }
            try {
                const fileFleetData = getFleetData(await file.text());
                if ( fileFleetData ) return setData(() => fileFleetData);
            }
            catch {}
            alert('Failed to import data from provided file. Please provide a valid .json file.');
        });
        inputFile.click();
    }

    const exportFleet = useCallback(() => {
        const fleetStr = fleetDataToString();
        if (!fleetStr) return alert('Failed to export fleet data. Please try again later.');
        const a = document.createElement('a');
        a.download = 'fleet_data.json';
        a.href = "data:text/json;charset=utf-8," + encodeURIComponent(fleetStr);
        a.click();
    }, []);

    const saveFleet = () => {
        const fleetStr = fleetDataToString();
        if (!fleetStr) return alert('Failed to save fleet data. Please try again later.');
        localStorage.setItem('fleet_data', fleetStr);
        toastContext.createToast({
            type: 'success',
            title: 'Saved data',
            description: 'Fleet data successfully saved on your browser.'
        })
    }
    
    const clearFleet = () => {
        fleetData.ships.length = 0;
        setData(() => ({
            ...fleetData
        }));
    }

    const showCrew = (ship: ShipItemType) => {
        modalContext.showModal({
            id: 'add_crew_' + ship.id,
            title: 'Select crew for ' + ship.fullname,
            onClose: () => {
                setData(() => ({
                    ...fleetData
                }));
            },
            inside: <Crew ship={ ship } remainingFleetPoints={ fleetData.points.max - fleetData.points.current } />
        });
    }

    const editFleetSettings = () => {
        modalContext.showModal({
            id: 'edit_fleet_settings',
            title: 'Fleet settings',
            onClose: () => {
            },
            inside:
                <Settings
                    key={ Math.random() } // will surely reset the component (reset default data)
                    defaultData={{
                        name: defaultFleetData.name,
                        points: {
                            max: defaultFleetData.points.max
                        }
                    }}
                    data={{
                        name: fleetData.name,
                        points: {
                            max: fleetData.points.max
                        }
                    }}
                    onChange={ (newData) => {
                        fleetData.name = newData.name as string;
                        fleetData.points.max = (newData.points as DataType).max as number;
                        setData(() => ({
                            ...fleetData
                        }));

                        setTimeout(() => saveFleet(), 1);
                    }}
                />
        });
    }

    const headerInfo = (
        <span class="points">
            <i class="fas fa-coins" />&nbsp;&nbsp;{ fleetData.points.current }&nbsp;/&nbsp;{ fleetData.points.max }
        </span>
    );

    const actions = useMemo(() => (
        <>
            <IconButton iconID="share-square" class="export" onClick={exportFleet} title="Export to file" />
            <IconButton iconID="file-import" class="import" onClick={importFleet} title="Import from file" />
            <IconButton iconID="save" class="save" onClick={saveFleet} title="Save in browser" />
            <IconButton iconID="eraser" class="clear" onClick={clearFleet} title="Clear fleet" />
            <IconButton iconID="cog" class="settings" onClick={editFleetSettings} title="Edit fleet settings" />
        </>
    ), []);

    const fleet = 
        fleetData.ships.map( ship =>
            <ShipItem
                data={
                    ship
                }
                actions={
                    <>
                        <IconButton
                            onClick={() => showCrew(ship)} 
                            data-crew-room={ ship.crew.length ? ship.crew.length : null }
                            iconID="users-cog"
                        />
                        <IconButton iconID="minus-square" onClick={() => removeShip(ship)} />
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
                actions
            }
            items={
                fleet
            }
        />
    );
}

export default FleetDisplay;