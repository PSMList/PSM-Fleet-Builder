import { JSX, splitProps, Show } from "solid-js";
import Icon from "../Icon";
import "./IconButton.css";

type IconButtonProps = {
  iconID: string;
  primary?: boolean;
} & JSX.IntrinsicAttributes &
  JSX.HTMLAttributes<HTMLButtonElement>;

const IconButton = (props: IconButtonProps) => {
  const [localProps, buttonProps] = splitProps(props, [
    "iconID",
    "classList",
    "class",
    "primary",
  ]);

  return (
    <button
      {...buttonProps}
      classList={{
        icon_button: true,
        [localProps.class ?? ""]: true,
        primary: localProps.primary,
        ...localProps.classList,
      }}
    >
      <Icon iconID={localProps.iconID} />
      <Show when={props.children}>
        <span class="title">{props.children}</span>
      </Show>
    </button>
  );
};

export default IconButton;
