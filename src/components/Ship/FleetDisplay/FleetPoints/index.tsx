import { faCoins } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "preact/hooks"
import { FleetDataType } from ".."
import { isStrPositiveInt } from "../../../../utils"
import EditableText from "../../../commons/EditableText"

export type FleetPointsProps = {
    fleetData: FleetDataType
}

const FleetPoints = ({ fleetData }: FleetPointsProps) => {
    const [fleetMaxPoints, setFleetMaxPoints] = useState(fleetData.points.max);

    fleetData.points.max = fleetMaxPoints;

    const changeFleetMaxPoints = (newFleetMaxPoints: string) => {
        if (!(newFleetMaxPoints && isStrPositiveInt(newFleetMaxPoints))) {
            alert('Please provide a valid and positive number.');
            return false;
        }
        setFleetMaxPoints(() => parseInt(newFleetMaxPoints));
        fleetData.points.max
        return true;
    }

    return (
        <span class="points">
            <FontAwesomeIcon icon={faCoins} />&nbsp;&nbsp;{fleetData.points.current}&nbsp;/&nbsp;
                <EditableText
                    onEdit={changeFleetMaxPoints}
                    value={fleetData.points.max.toString()} />
        </span>
    );
}

export default FleetPoints;