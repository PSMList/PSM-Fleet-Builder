import { createRef } from "preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { JSX } from "preact/jsx-runtime"
import IconButton from "../../IconButton"
import './ValidationInput.css'

type TextInputProps = {
    focus?: boolean
    onValidate: (value: string | boolean) => void
    onKeyPress?: (event: Event) => void
} & JSX.HTMLAttributes<HTMLInputElement>

const ValidationInput = ({ focus = false, onValidate, ...props }: TextInputProps) => {
    const [ defaultValue, setDefaultValue ] = useState<string | boolean>('');
    
    useEffect(() => {
        setDefaultValue(() => (props.value || props.defaultValue) as string || props.checked as boolean || '');
    }, [props.value || props.defaultValue || props.checked  || ''])

    const inputRef = createRef<HTMLInputElement>();

    const validate = () => {
        if (!inputRef.current) return;
        const newValue = inputRef.current.type !== 'checkbox' ? inputRef.current.value : inputRef.current.checked;
        if (newValue === defaultValue) return;
        onValidate(newValue);
        setDefaultValue(() => newValue);
    }

    const undo = () => {
        if (!inputRef.current) return;
        if (inputRef.current.type !== 'checkbox') {
            inputRef.current.value = defaultValue as string;
        }
        else {
            inputRef.current.checked = defaultValue as boolean;
        }
    }

    return (
        <form class="validation_input" onSubmit={ (event) => event.preventDefault() }>
            <div class="validation_container">
                <input
                    ref={ (ref) => {
                        if (!ref) return;
                        inputRef.current = ref;
                        if (focus) setTimeout(() => ref.focus(), 1);
                    } }
                    value={ typeof defaultValue !== 'boolean' ? defaultValue : null as unknown as string }
                    checked={ typeof defaultValue === 'boolean' ? defaultValue : null as unknown as boolean }
                    { ...props }
                    onKeyPress={ (event) => {
                        if (event.key === 'Enter') {
                            // event.preventDefault();
                            validate();
                        }
                        if (props.onKeyPress) {
                            props.onKeyPress(event);
                        }
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