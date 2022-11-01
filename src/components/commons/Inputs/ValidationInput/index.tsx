import { faCheck, faRotateBackward } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createRef } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import './ValidationInput.css'

type TextInputProps = {
    focus?: boolean
    onValidate: (event: InputEvent) => void
} & JSX.HTMLAttributes<HTMLInputElement>

const ValidationInput = ({ focus = false, onValidate, ...props }: TextInputProps) => {
    const [ defaultValue, setDefaultValue ] = useState((props.value || props.defaultValue || '') as string);

    const inputRef = createRef<HTMLInputElement>();
    const inputEventRef = createRef<InputEvent>();

    // return useMemo(() =>
    return (
        <form class="validation_input" onSubmit={ (event) => event.preventDefault() }>
            <div>
                <input
                    { ...props }
                    onChange={ (event) => inputEventRef.current = event as Event as InputEvent }
                    ref={ (ref) => {
                        if (!ref) return;
                        inputRef.current = ref;
                        if (focus) setTimeout(() => ref.focus(), 1);
                    } }
                />
                <button onClick={ () => {
                    console.log(inputRef.current, defaultValue);
                    
                    if (inputRef.current) inputRef.current.value = defaultValue;
                } }>
                    <FontAwesomeIcon icon={ faRotateBackward } />
                </button>
                <button onClick={ () => {
                    if (!inputEventRef.current) return;
                    onValidate(inputEventRef.current);
                    console.log();
                    
                    setDefaultValue(() => inputRef.current?.value || '');
                 } } >
                    <FontAwesomeIcon icon={ faCheck } />
                </button>
            </div>
        </form>
    // , [inputEvent, defaultValue]);
    );
}

export default ValidationInput;