import { JSX, Ref } from "solid-js";
import "./Display.css";

interface DisplayProps {
  ref: Ref<HTMLDivElement>;
  header?: JSX.Element;
  actions?: JSX.Element;
  items: JSX.Element;
}

const Display = (props: DisplayProps) => {
  return (
    <div class="display_container" ref={props.ref}>
      <div class="display_header whitebox">
        {props.header && <div class="info">{props.header}</div>}
        <div class="actions">{props.actions}</div>
      </div>
      <div class="whitebox display_grid">{props.items}</div>
    </div>
  );
};

export default Display;
