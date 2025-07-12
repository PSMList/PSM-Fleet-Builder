import "./Display.scss";

import { For, JSX, Show } from "solid-js";

import { AddItems, Clear, Collapse } from "./actions";
import { useCollapse } from "../Collapse/CollapseProvider";
import { ItemList } from "../Item/ItemList";
import { Icon } from "../Icon/Icon";
import { isOwn } from "@/utils/config";

export interface DisplayProps {
  header?: JSX.Element;
  actions?: JSX.Element;
  items: JSX.Element[];
  name: string;
}

export function Display(props: DisplayProps) {
  const [collapsed] = useCollapse();

  return (
    <div class="display">
      <div class="header whitebox">
        {props.header && <div class="info">{props.header}</div>}
        <div class="actions">
          <AddItems name={props.name} />
          <Collapse />
          <Clear name={props.name} />
          {props.actions}
        </div>
      </div>
      <div class="content whitebox">
        <ItemList collapsed={collapsed()}>
          <For
            each={props.items}
            fallback={
              <Show
                when={isOwn}
                fallback={<h3 class="info">No {props.name} added.</h3>}
              >
                <h3 class="info">
                  Click on <Icon id="search-plus" /> to add {props.name}.
                </h3>
              </Show>
            }
          >
            {(item) => item}
          </For>
        </ItemList>
      </div>
    </div>
  );
}
