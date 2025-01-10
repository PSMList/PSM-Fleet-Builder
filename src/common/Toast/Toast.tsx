import "./Toast.scss";

import { Accessor, JSX, Show } from "solid-js";

import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { capitalize } from "@/utils/string";

type ToastTypes = "info" | "success" | "warning" | "error";

const icons: { [K in ToastTypes]: string } = {
  info: "info-circle",
  success: "check-circle",
  warning: "exclamation-triangle",
  error: "exclamation-circle",
};

export type ToastPosition =
  | "top-right"
  | "bottom-right"
  | "top-left"
  | "bottom-left";

export interface ToastType {
  id: string;
  type: ToastTypes;
  title?: string;
  description?: JSX.Element;
  hidden?: boolean;
}

export type ToastProps = ToastType & {
  count: Accessor<number>;
  hide: (id: ToastType["id"]) => void;
};

function backgroundColor(type: ToastTypes) {
  switch (type) {
    case "info":
      return "#5bc0de";
    case "success":
      return "#5cb85c";
    case "warning":
      return "#f0ad4e";
    case "error":
      return "#d9534f";
  }
}

export function Toast(props: ToastProps) {
  function title() {
    return props.title ?? capitalize(props.type);
  }

  return (
    <div
      classList={{
        toast: true,
        hide: props.hidden,
      }}
      style={{ "background-color": backgroundColor(props.type) }}
    >
      <span class="close">
        <IconButton
          id="times"
          onClick={() => props.hide(props.id)}
          title="Close"
        />
      </span>
      <i class={`image fas fa-${icons[props.type]}`} title={title()} />
      <span class="title">
        {props.title}
        <Show when={props.count() > 1}>&nbsp;x{props.count()}</Show>
      </span>
      <span class="message">{props.description}</span>
    </div>
  );
}
