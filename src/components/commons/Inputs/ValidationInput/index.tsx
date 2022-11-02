import { createRef } from "preact"
import { useCallback, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import IconButton from "../../IconButton"
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

    const validate = useCallback(() => {
        if (!inputEventRef.current) return;
        onValidate(inputEventRef.current);
        setDefaultValue(() => inputRef.current?.value || '');
    }, []);

    return (
        <form class="validation_input" onSubmit={ (event) => event.preventDefault() }>
            <div class="validation_container">
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
                <IconButton
                    onClick={ () => {
                        if (inputRef.current) inputRef.current.value = defaultValue;
                    } }
                    iconID="undo"
                />
                <IconButton
                    onClick={ () => {
                        validate();
                    } }
                    iconID="check"
                />
            </div>
        </form>
    );
}

export default ValidationInput;