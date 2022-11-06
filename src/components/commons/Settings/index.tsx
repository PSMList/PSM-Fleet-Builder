import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { capitalize } from "../../../utils";
import IconButton from "../IconButton";
import ValidationInput from "../Inputs/ValidationInput";
import './Settings.css';

export type DataType = { [key: string]: string | number | boolean | DataType }

type SettingsProps = {
    data: DataType
    defaultData?: DataType
    onChange: (data: DataType) => void
    class?: string
}

type InputSettings = {
    onChange: (event: Event) => void
    onValidate: (value: string | boolean) => void
    name: string, type: string
    value?: string
    checked?: boolean
    min?: number
}

const Settings = ({ data, defaultData, onChange: onSave, class: _class }: SettingsProps) => {    

    const [settings, setSettings] = useState(data);

    const save = (settings: DataType) => {
        const newSettings = {
            ...settings
        }
        onSave(newSettings);
        setSettings(() => newSettings);
    }

    const setInputData = (inputData: DataType, title: string): JSX.Element => {
        const elements = [];
        for (const itemKey in inputData) {
            const item = inputData[itemKey];
            
            const onChange = (event: Event) => {
                const input = (event.target as HTMLInputElement);
                switch (input.type) {
                    case 'text':
                        inputData[itemKey] = input.value;
                        break;
                    case 'number':
                        inputData[itemKey] = parseInt(input.value);
                        break;
                    case 'checkbox':
                        inputData[itemKey] = input.checked;
                        break;
                }
            };
            const onValidate = (value: string | boolean) => {
                switch (typeof item) {
                    case 'string':
                        inputData[itemKey] = value as string;
                        break;
                    case 'number':
                        inputData[itemKey] = parseInt(value as string);
                        break;
                    case 'boolean':
                        inputData[itemKey] = value as boolean;
                        break;
                }
                save(settings);
            };

            let element: JSX.Element;
            const inputLabel = `${itemKey}${title ? ' ' + title : ''}`;
            const inputDataLabel = `${itemKey}${title ? '.' + title : ''}`;

            switch(typeof item) {
                case 'string':
                case 'number':
                case 'boolean':
                    const inputType = typeof item === 'boolean' ? 'checkbox' : (typeof item === 'number' ? 'number' : 'text');
                    const inputSettings: InputSettings = {
                        onValidate,
                        onChange,
                        name: inputDataLabel,
                        type: inputType
                    }
                    if (typeof item === 'boolean') {
                        inputSettings.checked = item;
                    }
                    else {
                        inputSettings.value = item.toString();
                    }
                    
                    if (inputType === 'number') inputSettings.min = 0;
                    
                    element = <div class="whitebox" key={ inputDataLabel }>
                        <label for={ inputDataLabel }>{ capitalize(inputLabel) }</label>
                        <ValidationInput { ...inputSettings } />
                    </div>
                    break;
                case 'object':
                    element = setInputData(item, inputLabel);
                    break;
                default:
                    continue;
            }

            elements.push( element );
        }

        return <>{ elements }</>;
    }

    const inputsData = setInputData(settings, '');

    return (
        <div class={ "settings_container" + (_class ? ' ' + _class : '') } >
            <div class="settings_header">
                <h3>
                    Save&nbsp;
                    <IconButton
                        onClick={ () => save(settings) }
                        iconID="save"
                    />
                </h3>
                { defaultData &&
                    <h3>
                        Reset to default&nbsp;
                        <IconButton
                            onClick={ () => {
                                save(defaultData);
                            } }
                            iconID="eraser"
                        />
                    </h3>
                }
            </div>
            <div class="settings_inputs">
                { inputsData }
            </div>
        </div>
    );
}

export default Settings;