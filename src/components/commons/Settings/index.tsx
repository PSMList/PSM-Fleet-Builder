import { createRef } from "preact";
import { useState } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import { capitalize } from "../../../utils";
import IconButton from "../IconButton";
import ValidationInput from "../Inputs/ValidationInput";
import './Settings.css';

type SettingsProps = {
    data: { [key: string]: any }
    defaultData?: { [key: string]: any }
    onChange: (data: { [key: string]: any }) => void
    class?: string
    className?: string
}

type InputSettings = { onChange: (event: Event) => void, onValidate: (event: Event) => void, name: string, type: string, value: string, min?: number | undefined }

const Settings = ({ data, defaultData, onChange: onSave, class: _class, className }: SettingsProps) => {    

    const [settings, setSettings] = useState(data);

    const setInputData = (inputData: { [key: string]: any }, title: string): JSX.Element => {
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
                }
            };
            const onValidate = (event: Event) => {
                onChange(event);
                const newSettings = {
                    ...settings
                }
                onSave(newSettings);
                setSettings(() => newSettings);
            };

            let element: JSX.Element;
            const inputLabel = `${itemKey}${title ? ' ' + title : ''}`;
            const inputDataLabel = `${itemKey}${title ? '.' + title : ''}`;

            switch(typeof item) {
                case 'string':
                case 'number':
                    const inputType = typeof item === 'string' ? 'text' : 'number';
                    const inputSettings: InputSettings = {
                        onValidate,
                        onChange,
                        name: inputDataLabel,
                        type: inputType,
                        value: item.toString()
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

    const settingsRef = createRef<HTMLDivElement>();

    return (
        <div class={ "settings_container" + (_class ? ' ' + _class : '') } className={ className } ref={ settingsRef } >
            <div class="settings_header">
                <h3>
                    Save&nbsp;
                    <IconButton
                        onClick={ () => {
                            const newSettings = {
                                ...settings
                            }
                            onSave(newSettings);
                            setSettings(() => newSettings);
                        } }
                        iconID="save"
                    />
                </h3>
                { defaultData &&
                    <h3>
                        Reset to default&nbsp;
                        <IconButton
                            onClick={ () => {
                                setSettings(() => ({
                                    ...defaultData
                                }));
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