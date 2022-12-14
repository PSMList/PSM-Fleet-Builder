import { JSX, splitProps } from "solid-js";
import './IconButton.css';

type IconButtonProps = {
    iconID: string
} & JSX.IntrinsicAttributes & JSX.HTMLAttributes<HTMLButtonElement>

const IconButton = (props: IconButtonProps) => {
    const [ localProps, buttonProps] = splitProps(props, ['iconID', 'classList', 'class']);

    return (
        <button { ...buttonProps } classList={{ "icon_button": true, [localProps.class || '']: true, ...localProps.classList }}>
            <i class={ "fas fa-" + localProps.iconID } />
        </button>
    );
};

export default IconButton;