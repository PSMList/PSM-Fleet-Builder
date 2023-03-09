import IconButton from "@/components/commons/IconButton";
import ValidationInput from "@/components/commons/Inputs/ValidationInput";
import { capitalize } from "@/utils";
import { For, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import './Settings.css';

type DataType = {
    onKeyPress?: (event: KeyboardEvent) => void
} & JSX.InputHTMLAttributes<HTMLInputElement>
export type Data = { [name: string]: DataType }

type SettingsProps = {
    data: Data
    onSave: (data: Data) => void
    class?: string
}

type InputSettings = {
    onValidate: (value: string | boolean) => void
    undo?: boolean
} & DataType

const Settings = (props: SettingsProps) => {

    const [settings, setSettings] = createStore(props.data);

    const save = () => {
        props.onSave(settings);
        setSettings(() => settings);
    }

    const undo = () => {
        setSettings(() => props.data);
    }

    const inputsData = (
        <For each={Object.entries(settings)}>
            {
                ([ name, _input ]) => {
                    const onChange = (event: Event) => {
                        const input = (event.target as HTMLInputElement);
                        switch (input.type) {
                            case 'number':
                                setSettings(name, "value", parseInt(input.value));
                                break;
                            case 'checkbox':
                                setSettings(name, "checked", input.checked);
                                break;
                            default:
                                setSettings(name, "value", input.value);
                                break;
                        }
                    };
                    const onValidate = (newValue: string | boolean) => {
                        switch (_input.type) {
                            case 'number':
                                setSettings(name, "value", parseInt(newValue as string));
                                break;
                            case 'checkbox':
                                setSettings(name, "checked", newValue as boolean);
                                break;
                            default:
                                setSettings(name, "value", newValue as string);
                                break;
                        }
                        save();
                    };

                    const inputSettings: InputSettings = {
                        ..._input,
                        onValidate,
                        onChange,
                        undo: true
                    }

                    return (
                        <div class="whitebox">
                            <label for={ name }>{ _input.name }</label>
                            <ValidationInput { ...inputSettings } />
                        </div>
                    );
                }
            }
        </For>
    );

    return (
        <div classList={{ settings_container: true, class: !!props.class }} >
            <div class="settings_header">
                <h3>
                    Save&nbsp;
                    <IconButton
                        onClick={ save }
                        iconID="save"
                        title="Save"
                    />
                </h3>
                <h3>
                    Undo changes&nbsp;
                    <IconButton
                        onClick={ undo }
                        iconID="undo"
                        title="Undo all changes"
                    />
                </h3>
            </div>
            <p class="indent">Valid special characters: ' : " _ - and accents</p>
            <div class="settings_inputs">
                { inputsData }
            </div>
        </div>
    );
}

export default Settings;