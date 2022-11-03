import { useContext, useEffect, useState } from "preact/hooks";
import { CrewItemsContext, CrewItemType } from "..";
import { removeItemFromArray } from "../../../utils";
import Display from "../../commons/Display";
import IconButton from "../../commons/IconButton";
import { ToastContext } from "../../commons/Toasts";
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
    const toastContext = useContext(ToastContext);

    const addCrew = (crew: CrewItemType) => {
        if ( crew.faction.id !== ship.faction.id ) return toastContext.createToast({
            type: 'error',
            title: 'Add crew',
            description: 'Crew must be from the same nation of its ship.'
        });
        if ( ship.crew.length + 1 > ship.cargo ) return toastContext.createToast({
            type: 'error',
            title: 'Add crew',
            description: 'Can\'t add crew due to cargo limit.'
        });
        if ( ship.crew.some(_crew => _crew.name === crew.name)) return toastContext.createToast({
            type: 'error',
            title: 'Add crew',
            description: 'Crew with the same name already selected.'
        });
        if (crewData.points.current + crew.points > crewData.points.max) return toastContext.createToast({
            type: 'warning',
            title: 'Add crew',
            description: 'Exceeding fleet max points. Use settings if you want to increase the limit.'
        });
        crewData.crews.push(crew);
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
        if (removeItemFromArray(crewData.crews, _crew => crew.id === _crew.id)) {
            setData(() => ({
                ...crewData
            }));
        }
    }
    
    const clearCrew = () => {
        toastContext.createToast({
            type: 'info',
            title: 'Clear crew',
            description: 'Removed crew data (not saved).'
        });
        crewData.crews.length = 0;
        setData(() => ({
            ...crewData
        }));
    }

    const headerInfo = (
        <>
            <span class="room"><i class="fas fa-users-friends" />&nbsp;&nbsp;{crewData.room.current}&nbsp;/&nbsp;{crewData.room.max}</span>
            &nbsp;&nbsp;
            <span class="points"><i class="fas fa-coins" />&nbsp;&nbsp;{crewData.points.current}&nbsp;/&nbsp;{crewData.points.max}</span>
        </>
    );

    const actions = (
        <IconButton iconID="eraser" class="clear" onClick={clearCrew} title="Clear crew" />
    );

    const shipCrew = 
        crewData.crews.map(crew =>
            <CrewItem
                data={
                    crew
                }
                actions={
                    <IconButton iconID="minus-square" onClick={() => removeCrew(crew)} />
                }
            />
        );

    return (
        <Display
            info={
                headerInfo
            }
            actions={
                actions
            }
            items={
                shipCrew
            }
        />
    );
}

export default CrewDisplay;