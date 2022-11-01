import { faCheck, faRotateBackward } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createRef } from "preact"
import { useMemo, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import './ValidationInput.css'

type TextInputProps = {
    focus?: boolean
    onChange: (event: InputEvent) => void
} & JSX.HTMLAttributes<HTMLInputElement>

const ValidationInput = ({ focus = false, onChange, ...props }: TextInputProps) => {
    const [ inputEvent, setInputEvent ] = useState<InputEvent | null>();
    const [ defaultValue, setDefaultValue ] = useState(props.defaultValue as string || '');

    const inputRef = createRef();

    return useMemo(() =>
        <form class="validation_input" onSubmit={ (event) => event.preventDefault() }>
            <div>
                <input
                    onChange={ (event) => {
                        event.preventDefault();
                        setInputEvent(event as unknown as InputEvent);
                     } }
                    { ...props }
                    ref={ (ref) => {
                        inputRef.current = ref;
                        if (focus) setTimeout(() => ref?.focus(), 1);
                    } }
                />
                <button onClick={ (event) => {
                    console.log(inputRef.current, defaultValue);
                    
                    if (inputRef.current) inputRef.current.value = defaultValue;
                } }>
                    <FontAwesomeIcon icon={ faRotateBackward } />
                </button>
                <button onClick={ (event) => {
                    if (inputRef.current && inputEvent) {
                        onChange(inputEvent);
                        setDefaultValue(() => inputRef.current.value);
                    }
                 } } >
                    <FontAwesomeIcon icon={ faCheck } />
                </button>
            </div>
        </form>
    , [inputEvent, defaultValue]);
}

export default ValidationInput;