import { createRef } from "preact"
import { useState } from "preact/hooks"
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
                    <i class="fas fa-undo" />
                </button>
                <button onClick={ () => {
                    validate();
                 } } >
                    <i class="fas fa-check" />
                </button>
            </div>
        </form>
    );
}

export default ValidationInput;