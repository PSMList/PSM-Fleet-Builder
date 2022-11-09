import { useContext, useEffect, useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { CrewItemsContext, CrewItemType } from "..";
import { onlyDisplay } from "../../../app";
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

    const toastContext = useContext(ToastContext);
    
    let removeCrewAction: (crew: CrewItemType) => JSX.Element | undefined;
    let crewActions: JSX.Element | undefined;
    
    if (!onlyDisplay) {

        const crewItemsContext = useContext(CrewItemsContext);

        const addCrew = (crew: CrewItemType) => {
            if ( ship.crew.length + 1 > ship.cargo ) return toastContext.createToast({
                type: 'error',
                title: 'Add crew',
                description: 'Can\'t add crew due to cargo limit.'
            });
            if ( crew.faction.id !== ship.faction.id ) toastContext.createToast({
                type: 'warning',
                title: 'Add crew',
                description: 'You happen to have picked a crew with a different from its ship faction. Please check if this what you really want to do before saving.'
            });
            if ( ship.crew.some(_crew => _crew.name === crew.name)) toastContext.createToast({
                type: 'warning',
                title: 'Add crew',
                description: 'You happen to have picked two or more crew with an identical name. Please check if this what you really want to do before saving.'
            });
            if (crewData.points.current + crew.points > crewData.points.max) toastContext.createToast({
                type: 'warning',
                title: 'Add crew',
                description: 'Exceeding fleet max points. Please go to the settings if you want to increase the limit.'
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

        crewActions = (
            <IconButton iconID="eraser" class="clear" onClick={clearCrew} title="Clear crew" />
        );
    
        removeCrewAction = (crew: CrewItemType) => <IconButton iconID="minus-square" onClick={() => removeCrew(crew)} />
    }

    const headerInfo = (
        <>
            <span class="room"><i class="fas fa-users-friends" />&nbsp;&nbsp;{crewData.room.current}&nbsp;/&nbsp;{crewData.room.max}</span>
            &nbsp;&nbsp;
            <span class="points"><i class="fas fa-coins" />&nbsp;&nbsp;{crewData.points.current}&nbsp;/&nbsp;{crewData.points.max}</span>
        </>
    );

    const shipCrew = 
        crewData.crews.map(crew =>
            <CrewItem
                data={
                    crew
                }
                actions={
                    removeCrewAction && removeCrewAction(ship)
                }
            />
        );

    return (
        <Display
            info={
                headerInfo
            }
            actions={
                crewActions
            }
            items={
                shipCrew
            }
        />
    );
}

export default CrewDisplay;