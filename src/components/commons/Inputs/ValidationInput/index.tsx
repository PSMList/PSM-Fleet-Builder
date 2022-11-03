import { createRef } from "preact"
import { useCallback, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import IconButton from "../../IconButton"
import './ValidationInput.css'

type TextInputProps = {
    focus?: boolean
    onValidate: (value: string) => void
    onKeyPress?: (event: KeyboardEvent) => void
} & JSX.HTMLAttributes<HTMLInputElement>

const ValidationInput = ({ focus = false, onValidate, onChange, ...props }: TextInputProps) => {
    const [ defaultValue, setDefaultValue ] = useState((props.value?.toString() || props.defaultValue?.toString() || '') as string);
    
    const inputRef = createRef<HTMLInputElement>();

    const validate = () => {
        if (!inputRef.current) return;
        const newValue = inputRef.current.value;
        setDefaultValue(() => newValue);
        onValidate(newValue);
    }

    const undo = () => {
        if (!inputRef.current) return;
        inputRef.current.value = defaultValue;
    }

    return (
        <form class="validation_input" onSubmit={ (event) => event.preventDefault() }>
            <div class="validation_container">
                <input
                    value={ defaultValue }
                    { ...props }
                    onKeyPress={ (event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            validate();
                        }
                        if (props.onKeyPress) {
                            props.onKeyPress(event);
                        }
                    } }
                    ref={ (ref) => {
                        if (!ref) return;
                        inputRef.current = ref;
                        if (focus) setTimeout(() => ref.focus(), 1);
                    } }
                />
                <IconButton
                    onClick={ undo }
                    iconID="undo"
                />
                <IconButton
                    onClick={ validate }
                    iconID="check"
                />
            </div>
        </form>
    );
}

export default ValidationInput;