import { faCoins, faEraser, faFileImport, faFloppyDisk, faShareFromSquare, faSquareMinus, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { shipDict, ShipItemsContext, ShipItemType } from "..";
import { removeItemFromArray } from "../../../utils";
import Display from "../../commons/Display";
import { ModalContext } from "../../commons/Modal";
import Crew, { crewDict, CrewItemsContext, CrewItemType } from "../../Crew";
import { CrewSavedDataType } from "../../Crew/CrewDisplay";
import ShipItem from "../ShipItem";
import FleetPoints from "./FleetPoints";
import './FleetDisplay.css';
import FleetTitle from "./FleetTitle";


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
    name: 'Fleet name to change (dbl click here)',
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

    console.log(fleetData.name);

    fleetData.points.current = fleetData.ships.reduce(
        (shipTotal: number, ship: ShipItemType) =>
            shipTotal
            +
            ship.crew.reduce((crewTotal: number, crew: CrewItemType) => crewTotal + crew.points, ship.points),
        0
    );

    const shipItemsContext = useContext(ShipItemsContext);
    const crewItemsContext = useContext(CrewItemsContext);
    const modalContext = useContext(ModalContext);

    const addShip = useCallback((ship: ShipItemType) => {
        if (fleetData.points.current + ship.points > fleetData.points.max) return alert('/!\ Exceeding fleet max points. Double-click on the max points to edit it.');
        if (fleetData.ships.some(_ship => _ship.name === ship.name)) return alert('Ship with the same name already selected.');
        fleetData.ships.push(ship);
        setData(() => ({
            ...fleetData
        }));
    }, []);

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
        setData(() => defaultFleetData);
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

    return (
        <Display
            title={
                <FleetTitle
                    value={ fleetData.name }
                    onChange={ (newValue: string) => (fleetData.name = newValue) && setData(() => ({ ...fleetData })) }
                />
            }
            info={
                
                <span class="points">
                    <FontAwesomeIcon icon={faCoins} />&nbsp;&nbsp;{ fleetData.points.current }&nbsp;/&nbsp;
                    <FleetPoints
                        value={ fleetData.points.max }
                        onChange={ (newValue: number) => (fleetData.points.max = newValue) && setData(() => ({ ...fleetData })) }
                    />
                </span>
            }
            actions={
                <>
                    <button class="import" onClick={importFleet} alt="Import from file"><FontAwesomeIcon icon={faFileImport} /></button>
                    <button class="export" onClick={exportFleet} alt="Export to file"><FontAwesomeIcon icon={faShareFromSquare} /></button>
                    <button class="save" onClick={saveFleet} alt="Save in browser"><FontAwesomeIcon icon={faFloppyDisk} /></button>
                    <button class="clear" onClick={clearFleet} alt="Clear fleet"><FontAwesomeIcon icon={faEraser} /></button>
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
                                    <FontAwesomeIcon
                                        icon={faUserGroup}
                                    />
                                </button>
                                <button onClick={() => removeShip(ship)}>
                                    <FontAwesomeIcon icon={faSquareMinus} />
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