import Items from "@/components/commons/Items";
import { JSX, Ref, Show } from "solid-js";
import "./Display.css";

interface DisplayProps {
  ref: Ref<HTMLDivElement>;
  title?: string | JSX.Element;
  info?: JSX.Element;
  actions?: JSX.Element;
  items: JSX.Element;
}

const Display = (props: DisplayProps) => {
  return (
    <div class="display_container whitebox" ref={props.ref}>
      <div class="display_header">
        <div class="title">{props.title}</div>
        <Show when={props.info}>{props.info}</Show>
      </div>
      <div class="display_actions actions">{props.actions}</div>
      <Items class="display_grid">{props.items}</Items>
    </div>
  );
};

export default Display;
