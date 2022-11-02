import { useContext, useEffect, useState } from "preact/hooks";
import { shipDict, ShipItemsContext, ShipItemType } from "..";
import { removeItemFromArray } from "../../../utils";
import Display from "../../commons/Display";
import { ModalContext } from "../../commons/Modal";
import Settings from "../../commons/Settings";
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
        inputFile
        inputFile.click();
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
            alert('Failed to import data from provided file.');
        })
    }

    const exportFleet = () => {
        const fleetStr = fleetDataToString();
        if (!fleetStr) return alert('Failed to export fleet data. Please try again later.');
        const a = document.createElement('a');
        a.download = 'fleet_data.json';
        a.href = "data:text/json;charset=utf-8," + encodeURIComponent(fleetStr);
        a.click();
    }

    const saveFleet = () => {
        const fleetStr = fleetDataToString();
        if (!fleetStr) return alert('Failed to save fleet data. Please try again later.');
        localStorage.setItem('fleet_data', fleetStr);
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
                setData(() => ({
                    ...fleetData
                }));
            },
            inside:
                <Settings
                    class="main_container"
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
                        setTimeout(() => saveFleet(), 3000);
                        fleetData.name = newData.name;
                        fleetData.points.max = newData.points.max;
                        setData(() => ({
                            ...fleetData
                        }));
                    }}
                />
        });
    }

    return (
        <Display
            title={
                fleetData.name
            }
            info={
                <span class="points">
                    <i class="fas fa-coins" />&nbsp;&nbsp;{ fleetData.points.current }&nbsp;/&nbsp;{ fleetData.points.max }
                </span>
            }
            actions={
                <>
                    <button class="export" onClick={exportFleet} title="Export to file"><i class="fas fa-share-square" /></button>
                    <button class="import" onClick={importFleet} title="Import from file"><i class="fas fa-file-import" /></button>
                    <button class="save" onClick={saveFleet} title="Save in browser"><i class="fas fa-save" /></button>
                    <button class="clear" onClick={clearFleet} title="Clear fleet"><i class="fas fa-eraser" /></button>
                    <button class="settings" onClick={editFleetSettings} title="Edit fleet settings"><i class="fas fa-cog" /></button>
                </>
            }
            items={
                fleetData.ships.map( ship =>
                    <ShipItem
                        data={
                            ship
                        }
                        actions={
                            <>
                                <button onClick={() => showCrew(ship)} 
                                        data-crew-room={ ship.crew.length ? ship.crew.length : null }>
                                    <i class="fas fa-users-cog" />
                                </button>
                                <button onClick={() => removeShip(ship)}>
                                    <i class="fas fa-minus-square" />
                                </button>
                            </>
                        }
                    />
                )
            }
        />
    );
}

export default FleetDisplay;