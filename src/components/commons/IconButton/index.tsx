import { useMemo } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";
import './IconButton.css';

type IconButtonProps = {
    iconID: string
} & JSX.IntrinsicAttributes & JSX.HTMLAttributes<HTMLButtonElement>

const IconButton = ({ iconID, ...props }: IconButtonProps) => useMemo(() =>
    <button { ...props } class={ "icon_button" + (props.class ? ' ' + props.class : '') }>
        <i class={ "fas fa-" + iconID } />
    </button>
, []);

export default IconButton;