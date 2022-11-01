import { JSX } from "preact/jsx-runtime";
import { capitalize } from "../../../utils";
import ValidationInput from "../Inputs/ValidationInput";
import './Settings.css';

type SettingsProps = {
    data: { [key: string]: any }
    onChange: (data: { [key: string]: any }) => void
}

type InputSettings = { onChange: (event: Event) => void, name: string, type: string, defaultValue: string, min?: number | undefined }

const Settings = ({ data, onChange }: SettingsProps) => {
    // console.log('worx');

    const setInputData = (inputData: { [key: string]: any }, title: string): JSX.Element => {
        const elements = [];
        for (const itemKey in inputData) {
            const item = inputData[itemKey];
            
            const _onChange = (event: Event) => {
                console.log(event);
                const input = (event.target as HTMLInputElement);
                switch (input.type) {
                    case 'text':
                        inputData[itemKey] = input.value;
                        break;
                    case 'number':
                        inputData[itemKey] = parseInt(input.value);
                        break;
                }
                onChange(data);
            };

            let element: JSX.Element;
            const inputLabel = `${itemKey}${title ? ' ' + title : ''}`;

            switch(typeof item) {
                case 'string':
                case 'number':
                    const inputType = typeof item === 'string' ? 'text' : 'number';
                    const inputSettings: InputSettings = {
                        onChange: _onChange,
                        name: itemKey,
                        type: inputType,
                        defaultValue: item.toString()
                    }
                    if (inputType === 'number') inputSettings.min = 0;
                    
                    element = <div class="whitebox">
                        <label for={ itemKey }>{ capitalize(inputLabel) }</label><ValidationInput { ...inputSettings } />
                    </div>
                    break;
                case 'object':
                    // if (Array.isArray(item)) continue;
                    element = setInputData(item, inputLabel);
                    break;
                default:
                    continue;
            }

            elements.push(element
                // { element }
            );
        }

        return <>{ elements }</>;
    }

    const inputsData = setInputData(data, '');

    return (
        <div class="settings">
            { inputsData }
        </div>
    );
}

export default Settings;