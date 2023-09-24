import { ExtensionType } from "@/data/extension";
import { FactionType } from "@/data/faction";
import { RarityType } from "@/data/rarity";
import { JSX } from "solid-js";
import "./Item.css";

export interface ItemType {
  id: number;
  img: string;
  altimg: string;
  faction?: FactionType;
  rarity: RarityType;
  extension: ExtensionType;
  name: string;
  numid: string;
  fullname: string;
  points?: number;
  defaultaptitude: string;
  custom: boolean;
}

export interface ItemsContextType<T extends ItemType> {
  add: (item: T) => void;
}

export interface ItemProps {
  actions?: JSX.Element;
  color: string;
  children: JSX.Element;
}

export const Item = (props: ItemProps) => {
  return (
    <li class="item" style={{ "background-color": `#${props.color}` }}>
      <div class="actions" style={{ "border-color": `#${props.color}` }}>
        {props.actions}
      </div>
      {props.children}
    </li>
  );
};

export default Item;
