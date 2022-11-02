import { useContext, useEffect, useState } from "preact/hooks";
import { removeItemFromArray } from "../../../utils";
import Display from "../../commons/Display";
import { CrewItemsContext, CrewItemType } from "../../Crew";
import { ShipItemType } from "../../Ship";
import CrewItem from "../CrewItem";
import './CrewDisplay.css';


export type CrewSavedDataType = {
    id: number
}

export type CrewDataType = {
    points: {
        current: number
        max: number
    }
    room: {
        current: number
        max: number
    },
    crews: CrewItemType[],
}

type CrewDisplayProps = {
    ship: ShipItemType
    remainingFleetPoints: number
}

const CrewDisplay = ({ ship, remainingFleetPoints }: CrewDisplayProps) => {

    const [crewData, setData] = useState<CrewDataType>({
        points: {
            current: 0,
            max: 0
        },
        room: {
            current: 0,
            max: 0
        },
        crews: []
    });

    useEffect(() => {
        crewData.points.max = crewData.points.current + remainingFleetPoints;
        crewData.room.max = ship.cargo;
        crewData.crews = ship.crew;
        setData(() => ({
            ...crewData
        }));
    }, [ship]);

    crewData.points.current = ship.crew.reduce((total: number, crew: CrewItemType) => total + crew.points, 0);
    crewData.room.current = ship.crew.length;

    const crewItemsContext = useContext(CrewItemsContext);

    const addCrew = (crew: CrewItemType) => {
        if (crewData.points.current + crew.points > crewData.points.max) return alert('/!\ Exceeding fleet max points. Return to fleet and double-click on the max points to edit it.');
        if ( crew.faction.id !== ship.faction.id ) return alert('Crew must be from the same nation of its ship.');
        if ( ship.crew.length + 1 > ship.cargo ) return alert('Can\'t add crew due to cargo limit.');
        if ( ship.crew.some(_crew => _crew.name === crew.name)) return alert('Crew with the same name already selected.');
        ship.crew.push(crew);
        setData(() => ({
            ...crewData
        }));
    }

    useEffect(() => {
        crewItemsContext.selectItemCallbacks.push(addCrew);

        return () => {
            removeItemFromArray(crewItemsContext.selectItemCallbacks, func => func === addCrew);
        }
    }, [ship]);

    const removeCrew = (crew: CrewItemType) => {
        if (removeItemFromArray(ship.crew, _crew => crew.id === _crew.id)) {
            setData(() => ({
                ...crewData
            }));
        }
    }
    
    const clearCrew = () => {
        ship.crew.length = 0;
        setData(() => ({
            ...crewData
        }));
    }

    return (
        <Display
            info={
                <>
                    <span class="room"><i class="fas fa-users-friends" />&nbsp;&nbsp;{crewData.room.current}&nbsp;/&nbsp;{crewData.room.max}</span>
                    &nbsp;&nbsp;
                    <span class="points"><i class="fas fa-coins" />&nbsp;&nbsp;{crewData.points.current}&nbsp;/&nbsp;{crewData.points.max}</span>
                </>
            }
            actions={
                <>
                    <button class="clear" onClick={clearCrew} title="Clear crew"><i class="fas fa-eraser" /></button>
                </>
            }
            items={
                ship.crew.map(crew =>
                    <CrewItem
                        data={
                            crew
                        }
                        actions={
                            <button onClick={() => removeCrew(crew)}>
                                <i class="fas fa-minuss-square" />
                            </button>
                        }
                    />
                )
            }
        />
    );
}

export default CrewDisplay;