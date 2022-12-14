import IconButton from "@/components/commons/IconButton";
import { createEffect, createSignal, JSX, splitProps } from "solid-js";
import './ValidationInput.css';

type ValidationInputProps<T extends string | boolean> = {
    focus?: boolean
    onValidate: (value: T) => void
    onKeyPress?: (event: KeyboardEvent) => void
} & JSX.InputHTMLAttributes<HTMLInputElement>

const ValidationInput = <T extends string | boolean>(props: ValidationInputProps<T>) => {
    const [ defaultValue, setDefaultValue ] = createSignal<T>();

    const [ localProps, inputProps ] = splitProps(props, ['focus', 'onValidate', 'onKeyPress']);

    createEffect(() => {
        // @ts-expect-error just ignore
        setDefaultValue(() => inputProps.value as string || inputProps.checked as boolean || '');
    });

    let inputRef: HTMLInputElement;

    const validate = () => {
        if (!inputRef) return;
        const newValue = (inputRef.type !== 'checkbox' ? inputRef.value : inputRef.checked) as T;
        if (newValue === defaultValue()) return;
        localProps.onValidate(newValue);
        setDefaultValue(() => newValue);
    }

    const undo = () => {
        if (!inputRef) return;
        if (inputRef.type !== 'checkbox') {
            inputRef.value = defaultValue() as string;
        }
        else {
            inputRef.checked = defaultValue() as boolean;
        }
    }

    return (
        <form class="validation_input" onSubmit={ (event) => event.preventDefault() }>
            <div class="validation_container">
                <input
                    ref={ (ref) => {
                        if (!ref) return;
                        inputRef = ref;
                        if (localProps.focus) setTimeout(() => ref.focus(), 1);
                    } }
                    { ... {
                        [typeof defaultValue() === 'boolean' ? 'value': 'checked']: defaultValue()
                    }}
                    { ...inputProps }
                    onKeyPress={ (event) => {
                        if (event.key === 'Enter') {
                            // event.preventDefault();
                            validate();
                        }
                        if (localProps.onKeyPress) {
                            localProps.onKeyPress(event);
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