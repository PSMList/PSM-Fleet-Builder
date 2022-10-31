import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useMemo, useState } from "preact/hooks"
import { isStrPositiveInt } from "../../../../utils"
import EditableText from "../../../commons/EditableText"

export type FleetPointsProps = {
    value: number
    onChange: (value: number) => void
}

const FleetPoints = ({ value, onChange }: FleetPointsProps) => {
    const [fleetMaxPoints, setFleetMaxPoints] = useState(value);

    useEffect(() => {
        setFleetMaxPoints(() => value);
    }, [ value ]);
    
    return useMemo(() => {
        
        const changeFleetMaxPoints = (newFleetMaxPoints: string) => {
            if (!(newFleetMaxPoints && isStrPositiveInt(newFleetMaxPoints))) {
                alert('Please provide a valid and positive number.');
                return false;
            }
            setFleetMaxPoints(() => parseInt(newFleetMaxPoints));
            onChange(parseInt(newFleetMaxPoints));
            return true;
        }

        return (
            <EditableText
                onEdit={changeFleetMaxPoints}
                value={fleetMaxPoints.toString()} />
        );
    }, [ fleetMaxPoints ]);
}

export default FleetPoints;