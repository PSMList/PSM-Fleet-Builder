import { faCheck, faRotateBackward } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createRef } from "preact"
import { useEffect, useMemo, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import './ValidationInput.css'

type TextInputProps = {
    focus?: boolean
    onValidate: (event: InputEvent) => void
    onChange?: (event: InputEvent) => void
    onKeyPress?: (event: KeyboardEvent) => void
} & JSX.HTMLAttributes<HTMLInputElement>

const ValidationInput = ({ focus = false, onValidate, onChange, ...props }: TextInputProps) => {
    const [ defaultValue, setDefaultValue ] = useState((props.value || props.defaultValue || '') as string);

    const inputRef = createRef<HTMLInputElement>();
    const inputEventRef = createRef<InputEvent>();

    const validate = () => {
        if (!inputEventRef.current) return;
        onValidate(inputEventRef.current);
        setDefaultValue(() => inputRef.current?.value || '');
    }

    // return useMemo(() =>
    return (
        <form class="validation_input" onSubmit={ (event) => event.preventDefault() }>
            <div>
                <input
                    { ...props }
                    onChange={ (event) => {
                        const _event = event as Event as InputEvent;
                        inputEventRef.current = _event;
                        if (onChange) onChange(_event);
                    } }
                    onKeyPress={ (event) => {
                        if (event.key === 'Enter') {
                            validate()
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
                <button onClick={ () => {
                    if (inputRef.current) inputRef.current.value = defaultValue;
                } }>
                    <FontAwesomeIcon icon={ faRotateBackward } />
                </button>
                <button onClick={ () => {
                    validate();
                 } } >
                    <FontAwesomeIcon icon={ faCheck } />
                </button>
            </div>
        </form>
    // , [inputEvent, defaultValue]);
    );
}

export default ValidationInput;