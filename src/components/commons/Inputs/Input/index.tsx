import { JSX, splitProps } from "solid-js";
import "./Input.css";

function isTextArea(
  props:
    | JSX.TextareaHTMLAttributes<HTMLTextAreaElement>
    | JSX.InputHTMLAttributes<HTMLInputElement>
): props is JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  return "type" in props && props.type === "textarea";
}

export function isInput(
  target: HTMLInputElement | HTMLTextAreaElement
): target is HTMLInputElement {
  return "type" in target;
}

export type InputTypes = "text" | "number" | "checkbox" | "textarea";

export type InputProps<T extends InputTypes> = {
  type: T;
  onValidate?: (value: string | boolean) => void;
  class?: string;
} & (T extends "textarea"
  ? JSX.InputHTMLAttributes<HTMLInputElement>
  : JSX.TextareaHTMLAttributes<HTMLTextAreaElement>);

function Input<T extends InputTypes>(props: InputProps<T>) {
  const [formProps, inputProps] = splitProps(props, ["class"]) as [
    Pick<InputProps<T>, "class">,
    Exclude<InputProps<T>, "class">
  ];

  const onKeyPress: JSX.EventHandler<
    HTMLInputElement | HTMLTextAreaElement,
    KeyboardEvent
  > = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (typeof props.onValidate === "function") {
        const target = event.currentTarget;
        props.onValidate(
          isInput(target)
            ? target.type === "checkbox"
              ? target.checked
              : target.value
            : target.innerHTML
        );
      }
    }
    if (typeof props.onKeyPress === "function") {
      // @ts-expect-error props splitting causes event to target input and textarea types
      props.onKeyPress(event);
    }
  };

  return (
    <form onSubmit={(event) => event.preventDefault()} class={formProps.class}>
      <div class="validation_container">
        {isTextArea(inputProps) ? (
          <textarea
            {...inputProps}
            rows="20"
            cols="50"
            onKeyPress={onKeyPress}
          />
        ) : (
          <input {...inputProps} onKeyPress={onKeyPress} />
        )}
      </div>
    </form>
  );
}

export default Input;
