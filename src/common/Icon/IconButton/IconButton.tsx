import "./IconButton.scss";

import { JSX, splitProps, Show } from "solid-js";

import { Icon } from "@/common/Icon/Icon";

type IconButtonProps = {
  id: string;
  primary?: boolean;
} & JSX.IntrinsicAttributes &
  JSX.HTMLAttributes<HTMLButtonElement>;

export function IconButton(props: IconButtonProps) {
  const [localProps, buttonProps] = splitProps(props, [
    "id",
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
      <Icon id={localProps.id} />
      <Show when={props.children}>
        <span class="title">{props.children}</span>
      </Show>
    </button>
  );
}
