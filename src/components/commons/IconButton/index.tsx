import { JSX, splitProps, Show } from "solid-js";
import Icon from "../Icon";
import "./IconButton.css";

type IconButtonProps = {
  iconID: string;
  showTitle?: boolean;
} & JSX.IntrinsicAttributes &
  JSX.HTMLAttributes<HTMLButtonElement>;

const IconButton = (props: IconButtonProps) => {
  const [localProps, buttonProps] = splitProps(props, [
    "iconID",
    "classList",
    "class",
  ]);

  return (
    <button
      {...buttonProps}
      classList={{
        icon_button: true,
        [localProps.class ?? ""]: true,
        ...localProps.classList,
      }}
    >
      <Icon iconID={localProps.iconID} />
      <Show when={props.showTitle}>
        <span class="title">{props.title}</span>
      </Show>
    </button>
  );
};

export default IconButton;
