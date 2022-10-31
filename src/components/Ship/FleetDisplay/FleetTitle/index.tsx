import { useMemo, useState } from "preact/hooks";
import { FleetDataType } from "..";
import EditableText from "../../../commons/EditableText";

type FleetTitleProps = {
    fleetData: FleetDataType
}

const FleetTitle = ({ fleetData }: FleetTitleProps) => {
    const [ , setFleetName ] = useState(fleetData.name);
    
    return useMemo(() => {
        console.log(fleetData.name);
        
        const changeFleetName = (newFleetName: string) => {
            if (!(newFleetName && newFleetName.length >= 3 )) {
                alert('Please provide a name with at least 3 characters.');
                return false;
            }
            fleetData.name = newFleetName;
            setFleetName(() => newFleetName);
            return true;
        }
    
        return (
            <EditableText onEdit={ changeFleetName } value={ fleetData.name } />
        );
    }, [ fleetData.name ]);
}

export default FleetTitle;