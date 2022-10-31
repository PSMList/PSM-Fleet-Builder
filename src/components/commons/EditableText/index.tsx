import './EditableText.css';
import { useCallback, useState } from "preact/hooks";

type EditableTextProps = {
    onEdit: (newValue: string) => boolean
    value: string
}

const EditableText = ({ onEdit, value }: EditableTextProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const handleTyping = useCallback((event: KeyboardEvent) => {
        if (event.key !== 'Enter') return;
        const element = (event.target as HTMLInputElement);
        const confirm = onEdit(element.value);
        if (confirm) {
            setIsEditing(false);
        }
    }, []);
    
    return(
        <>
            {
                isEditing ?
                    <input
                        type='text'
                        onKeyPress={ (event) => handleTyping(event as KeyboardEvent) }
                        onfocusout={ () => setIsEditing(false) }
                        defaultValue={ value }
                        ref={ (ref) => ref?.focus() }
                    />
                    :
                    <span onDblClick={ ()=> setIsEditing(true) }>{ value }</span>
            }
        </>
    )
}

export default EditableText;