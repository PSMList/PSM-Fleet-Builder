import IconButton from "@/components/commons/IconButton";
import { createEffect, createSignal, JSX, splitProps } from "solid-js";
import './ValidationInput.css';

type ValidationInputProps<T extends string | boolean> = {
    focus?: boolean
    onValidate: (value: T) => void
    onKeyPress?: (event: KeyboardEvent) => void
    validationIcon?: string
    validationTitle?: string
} & JSX.InputHTMLAttributes<HTMLInputElement>

const ValidationInput = <T extends string | boolean>(props: ValidationInputProps<T>) => {
    const [ defaultValue, setDefaultValue ] = createSignal<T>();

    const [ localProps, inputProps ] = splitProps(props, ['focus', 'onValidate', 'onKeyPress']);

    if (typeof inputProps.type === "string" || inputProps.type === undefined) {
        inputProps.pattern = "[-\\w'\":\"\u00C0-\u00FF ]+";
    }

    createEffect(() => {
        // @ts-expect-error just ignore
        setDefaultValue(() => inputProps.value as string || inputProps.checked as boolean || '');
    });

    let inputRef: HTMLInputElement;
    let formRef: HTMLFormElement;

    const validate = () => {
        if (!inputRef) return;
        // trigger for submit to invoke native input error message
        if (!inputRef.checkValidity() && formRef) return formRef.submit();
        const newValue = (inputRef.type !== 'checkbox' ? inputRef.value : inputRef.checked) as T;
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
        <form
            class="validation_input"
            onSubmit={ (event) => event.preventDefault() }
            ref={ (ref) => {
                if (!ref) return;
                formRef = ref; 
            } }>
            <div class="validation_container">
                <input
                    ref={ (ref) => {
                        if (!ref) return;
                        inputRef = ref;
                        if (localProps.focus) setTimeout(() => ref.focus(), 1);
                    } }
                    { ...inputProps }
                    { ... {
                        [typeof defaultValue() === 'boolean' ? 'value': 'checked']: defaultValue()
                    }}
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
                    title="Undo"
                />
                <IconButton
                    onClick={ validate }
                    iconID={ props.validationIcon || "check" }
                    title={ props.validationTitle || "Validate" }
                />
            </div>
        </form>
    );
}

export default ValidationInput;