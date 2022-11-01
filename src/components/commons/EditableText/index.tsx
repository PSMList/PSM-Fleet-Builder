import './EditableText.css';
import { useCallback, useState } from "preact/hooks";
import Input from '../TextInput';

type EditableTextProps = {
    onEdit: (newValue: string) => boolean
    value: string
}

const EditableText = ({ onEdit, value }: EditableTextProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const handleTyping = useCallback((event: KeyboardEvent) => {
        console.log(event.key);
        
        if (event.key === 'Escape') return setIsEditing(() => false);
        if (event.key !== 'Enter') return;
        const element = (event.target as HTMLInputElement);
        const confirm = onEdit(element.value);
        if (confirm) {
            setIsEditing(() => false);
        }
    }, []);
    
    return(
        <>
            {
                isEditing ?
                    <Input
                        type='text'
                        onKeyPress={ (event) => handleTyping(event as KeyboardEvent) }
                        onfocusout={ () => setIsEditing(() => false) }
                        defaultValue={ value }
                        focus={ true }
                    />
                    :
                    <span onDblClick={ ()=> setIsEditing(() => true) }>{ value }</span>
            }
        </>
    )
}

export default EditableText;