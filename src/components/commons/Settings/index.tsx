import IconButton from "@/components/commons/IconButton";
import ValidationInput from "@/components/commons/Inputs/ValidationInput";
import { capitalize } from "@/utils";
import { For, JSX, Show } from "solid-js";
import { createStore } from "solid-js/store";
import './Settings.css';
type DataType = string | number | boolean
export type Data = { [key: string]: DataType }

type SettingsProps = {
    data: Data
    onSave: (data: Data) => void
    class?: string
}

type InputSettings = {
    onChange: (event: Event) => void
    onValidate: (value: DataType) => void
    name: string, type: string
    value?: string
    checked?: boolean
    min?: number
}

const Settings = (props: SettingsProps) => {    

    const [settings, setSettings] = createStore(props.data);

    const save = (settings: Data) => {
        props.onSave(settings);
        setSettings(() => settings);
    }

    const inputsData = (
        <For each={Object.entries(props.data)}>
            {
                ([ name, value ]) => {
                    const onChange = (event: Event) => {
                        const input = (event.target as HTMLInputElement);
                        switch (input.type) {
                            case 'text':
                                setSettings(name, input.value);
                                break;
                            case 'number':
                                setSettings(name, parseInt(input.value));
                                break;
                            case 'checkbox':
                                setSettings(name, input.checked);
                                break;
                        }
                    };
                    const onValidate = (newValue: DataType) => {
                        switch (typeof value) {
                            case 'string':
                                setSettings(name, newValue as string);
                                break;
                            case 'number':
                                setSettings(name, parseInt(newValue as string));
                                break;
                            case 'boolean':
                                setSettings(name, newValue as boolean);
                                break;
                        }
                        save(settings);
                    };

                    const inputType = typeof value === 'boolean' ? 'checkbox' : (typeof value === 'number' ? 'number' : 'text');
                    const inputSettings: InputSettings = {
                        onValidate,
                        onChange,
                        name,
                        type: inputType
                    }
                    if (typeof value === 'boolean') {
                        inputSettings.checked = value;
                    }
                    else {
                        inputSettings.value = value.toString();
                        if (inputType === 'number') inputSettings.min = 0;
                    }
                    

                    return (
                        <div class="whitebox">
                            <label for={ name }>{ capitalize(name) }</label>
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
                        onClick={ () => save(settings) }
                        iconID="save"
                    />
                </h3>
                <h3>
                    Reset to default&nbsp;
                    <IconButton
                        onClick={ () => save(props.data) }
                        iconID="eraser"
                    />
                </h3>
            </div>
            <div class="settings_inputs">
                { inputsData }
            </div>
        </div>
    );
}

export default Settings;