import { onlyDisplay } from "@/App";
import Display from "@/components/commons/Display";
import IconButton from "@/components/commons/IconButton";
import { ToastContext } from "@/components/commons/Toasts";
import { CrewItemsContext } from "@/components/Crew";
import CrewItem from "@/components/Crew/CrewItem";
import { CrewType } from "@/data/crew";
import { ShipType } from "@/data/ship";
import { createEffect, For, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
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
    crews: CrewType[],
}

type CrewDisplayProps = {
    ship: ShipType
    remainingFleetPoints: number
}

const CrewDisplay = (props: CrewDisplayProps) => {

    const [crewData, setData] = createStore<CrewDataType>({
        points: {
            current: 0,
            max: 0
        },
        room: {
            current: 0,
            max: props.ship.cargo
        },
        crews: []
    });

    createEffect(() => {
        setData("room", "current", crewData.crews.length);
    });

    createEffect(() => {
        setData(produce(data => {
            data.crews = props.ship.crew;
            data.points.current = data.crews.reduce((total: number, crew: CrewType) => total + crew.points, 0);
            data.points.max = data.points.current + props.remainingFleetPoints;
        }));
    });
    
    let removeCrewAction: (crew: CrewType) => JSX.Element | undefined;
    let crewActions: JSX.Element | undefined;
    
    if (!onlyDisplay) {

        const toastContext = useContext(ToastContext);

        const crewItemsContext = useContext(CrewItemsContext);

        const addCrew = (crew: CrewType) => {
            if ( props.ship.crew.length + 1 > props.ship.cargo ) toastContext.createToast({
                type: 'warning',
                title: 'Add crew',
                description: 'Exceeding cargo limit.'
            });
            if ( crew.faction.id !== props.ship.faction.id ) toastContext.createToast({
                type: 'warning',
                title: 'Add crew',
                description: 'You happen to have picked a crew with a different from its ship faction. Please check if this what you really want to do before saving.'
            });
            if ( props.ship.crew.some(_crew => _crew.name === crew.name)) toastContext.createToast({
                type: 'warning',
                title: 'Add crew',
                description: 'You happen to have picked two or more crew with an identical name. Please check if this what you really want to do before saving.'
            });
            if (crewData.points.current + crew.points > crewData.points.max) toastContext.createToast({
                type: 'warning',
                title: 'Add crew',
                description: 'Exceeding fleet max points. Please go to the settings if you want to increase the limit.'
            });
            setData(produce(data => {
                data.crews.push({ ...crew });
            }));
        }

        crewItemsContext.add = addCrew;

        const removeCrew = (crew: CrewType) => {
            const crewIndex = crewData.crews.findIndex(_crew => crew === _crew);
            if (crewIndex >= 0) {
                setData(produce((data) => {
                    data.crews.splice(crewIndex, 1);
                }));
            }
        }
        
        const clearCrew = () => {
            toastContext.createToast({
                type: 'info',
                title: 'Clear crew',
                description: 'Removed crew data (not saved).'
            });
            setData(produce(data => {
                data.crews.length = 0;
            }));
        }

        crewActions = (
            <IconButton
                iconID="eraser"
                class="clear"
                onClick={clearCrew}
                title="Clear all crew"
            />
        );
    
        removeCrewAction = (crew: CrewType) =>
            <IconButton
                iconID="minus-square"
                onClick={() => removeCrew(crew)}
                title="Remove crew"
            />
    }

    const headerInfo = (
        <>
            <span class="room"><i class="fas fa-users-friends" />&nbsp;&nbsp;{crewData.room.current}&nbsp;/&nbsp;{crewData.room.max}</span>
            &nbsp;&nbsp;
            <span class="points"><i class="fas fa-coins" />&nbsp;&nbsp;{crewData.points.current}&nbsp;/&nbsp;{crewData.points.max}</span>
        </>
    );
    

    const shipCrew = (
        <For each={crewData.crews}>
            {
                crew =>
                    <CrewItem
                        data={
                            crew
                        }
                        actions={
                            removeCrewAction && removeCrewAction(crew)
                        }
                    />
            }
        </For>
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