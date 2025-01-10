import "./Input.scss";

import { JSX, splitProps } from "solid-js";

function isTextArea(
  props:
    | JSX.TextareaHTMLAttributes<HTMLTextAreaElement>
    | JSX.InputHTMLAttributes<HTMLInputElement>,
): props is JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  return (props as { type: string }).type === "textarea";
}

export type InputTypes = "text" | "number" | "checkbox" | "textarea";

export type InputProps<T extends InputTypes> = {
  type: T;
  onChange?: (value: T extends "checkbox" ? boolean : string) => void;
  class?: string;
} & (T extends "textarea"
  ? JSX.TextareaHTMLAttributes<HTMLTextAreaElement>
  : JSX.InputHTMLAttributes<HTMLInputElement & { type: Omit<T, "textarea"> }>);

export function Input<T extends InputTypes>(props: InputProps<T>) {
  const [formProps, inputProps] = splitProps(props, ["class"]) as [
    Pick<InputProps<T>, "class">,
    Exclude<InputProps<T>, "class">,
  ];

  function onChange<H extends HTMLInputElement | HTMLTextAreaElement>(
    event: Event & {
      currentTarget: H;
      target: H;
    },
  ) {
    if (typeof props.onChange !== "function") return;

    const target = event.currentTarget;
    const value = (
      target instanceof HTMLInputElement
        ? target.value
        : (target as HTMLTextAreaElement).value
    ) as T extends "checkbox" ? boolean : string;

    props.onChange(value);
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} class={formProps.class}>
      {isTextArea(inputProps) ? (
        <textarea rows="20" cols="50" {...inputProps} onChange={onChange} />
      ) : (
        <input {...inputProps} onChange={onChange} />
      )}
    </form>
  );
}
