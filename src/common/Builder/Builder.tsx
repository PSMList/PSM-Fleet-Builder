import "./Builder.scss";

import {
  BuilderSearch,
  BuilderSearchProps,
} from "./BuilderSearch/BuilderSearch";
import {
  BuilderDisplay,
  BuilderDisplayProps,
} from "./BuilderDisplay/BuilderDisplay";
import { Item } from "../Item/ItemCard";

export type BuilderProps<T extends Item> = BuilderSearchProps<T> &
  BuilderDisplayProps<T>;

export function Builder<T extends Item>(props: BuilderProps<T>) {
  return (
    <div class="main_container" id={props.name}>
      <BuilderSearch
        searchItem={props.searchItem}
        name={props.name}
        filters={props.filters}
        placeholder={props.placeholder}
      />
      <BuilderDisplay
        displayItem={props.displayItem}
        name={props.name}
        actions={props.actions}
        header={props.header}
      />
    </div>
  );
}
