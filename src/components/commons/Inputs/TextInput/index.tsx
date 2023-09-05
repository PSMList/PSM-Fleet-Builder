import { splitProps } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type TextInputProps = {
  focus?: boolean;
  type: string;
  defaultValue?: string;
} & JSX.HTMLAttributes<HTMLInputElement>;

const Input = (props: TextInputProps) => {
  const [localProps, formProps] = splitProps(props, ["focus"]);

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input {...formProps} ref={(ref) => localProps.focus && setTimeout(() => ref?.focus(), 1)} />
    </form>
  );
};

export default Input;
