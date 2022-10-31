import { useMemo, useState } from "preact/hooks";
import { FleetDataType } from "..";
import EditableText from "../../../commons/EditableText";

type FleetTitleProps = {
    fleetData: FleetDataType
}

const FleetTitle = ({ fleetData }: FleetTitleProps) => {
    const [ fleetName, setFleetName ] = useState(fleetData.name);
    
    return useMemo(() => {
        const changeFleetName = (newFleetName: string) => {
            if (!(newFleetName && newFleetName.length > 5 )) {
                alert('Please provide a name with at least 5 characters.');
                return false;
            }
            setFleetName(() => newFleetName);
            fleetData.name = newFleetName;
            return true;
        }
    
        return (
            <EditableText onEdit={ changeFleetName } value={ fleetName } />
        );
    }, [ fleetName ]);
}

export default FleetTitle;