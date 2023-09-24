import { JSX, splitProps } from "solid-js";
import "./Input.css";

function isTextArea(
  props:
    | JSX.TextareaHTMLAttributes<HTMLTextAreaElement>
    | JSX.InputHTMLAttributes<HTMLInputElement>
): props is JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  return "type" in props && props.type === "textarea";
}

export type InputTypes = "text" | "number" | "checkbox" | "textarea";

export type InputProps<T extends InputTypes> = {
  type: T;
  onValidate?: () => void;
  class?: string;
} & (T extends "textarea"
  ? JSX.InputHTMLAttributes<HTMLInputElement>
  : JSX.TextareaHTMLAttributes<HTMLTextAreaElement>);

function Input<T extends InputTypes>(props: InputProps<T>) {
  const [formProps, inputProps] = splitProps(props, ["class"]) as [
    Pick<InputProps<T>, "class">,
    Exclude<InputProps<T>, "class">
  ];

  return (
    <form onSubmit={(event) => event.preventDefault()} class={formProps.class}>
      <div class="validation_container">
        {isTextArea(inputProps) ? (
          <textarea {...inputProps} rows="20" cols="50" />
        ) : (
          <input
            {...inputProps}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (typeof props.onValidate === "function") {
                  props.onValidate();
                }
              }
              if (typeof props.onKeyPress === "function") {
                // @ts-expect-error props splitting causes event to target input and textarea types
                props.onKeyPress(event);
              }
            }}
          />
        )}
      </div>
    </form>
  );
}

export default Input;
