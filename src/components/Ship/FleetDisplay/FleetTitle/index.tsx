import { useEffect, useMemo, useState } from "preact/hooks";
import EditableText from "../../../commons/EditableText";

type FleetTitleProps = {
    value: string
    onChange: (value: string) => void
}

const FleetTitle = ({ value, onChange }: FleetTitleProps) => {
    const [fleetName, setFleetName] = useState(value);

    useEffect(() => {
        setFleetName(() => value);
    }, [ value ]);
    
    return useMemo(() => {

        const changeFleetName = (newFleetName: string) => {
            if (!(newFleetName && newFleetName.length >= 3 )) {
                alert('Please provide a name with at least 3 characters.');
                return false;
            }
            setFleetName(() => newFleetName);
            onChange(newFleetName);
            return true;
        }
    
        return (
            <EditableText onEdit={ changeFleetName } value={ fleetName } />
        );
    }, [ value, fleetName ]);
}

export default FleetTitle;