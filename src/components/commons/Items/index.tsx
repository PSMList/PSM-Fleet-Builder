import { JSX, splitProps } from "solid-js";
import "./Items.css";

const Items = (
  props: JSX.IntrinsicAttributes & JSX.HTMLAttributes<HTMLUListElement>
) => {
  const [localProps, ulProps] = splitProps(props, ["class", "classList"]);

  return (
    <ul
      {...ulProps}
      classList={{
        items: true,
        [localProps.class ?? ""]: true,
        ...localProps.classList,
      }}
    >
      {props.children}
    </ul>
  );
};

export default Items;
