import "./ItemCard.scss";

import { Component, JSX } from "solid-js";

import { Extension } from "@/store/data/extension";
import { IconButton } from "@/common/Icon/IconButton/IconButton";
import { baseImg } from "@/utils/config";
import { Faction } from "@/store/data/faction";
import { isDarkColor } from "@/utils/string";
import { Rarity } from "@/store/data/rarity";

export type ItemsType =
  | "ships"
  | "crew"
  | "treasures"
  | "equipments"
  | "islands"
  | "events"
  | "items";

export type ItemType =
  | "ship"
  | "crew"
  | "treasure"
  | "equipment"
  | "island"
  | "event";

export interface Item {
  id: number;
  type: ItemValue;
  name: string;
  numid: string;
  fullname: string;
  aptitude: string;
  custom: 0 | 1;
  img: string;
  extension: Extension;
  points?: number;
  faction?: Faction;
  rarity?: Rarity;
}

export enum ItemValue {
  Crew = 0,
  Ship = 1,
  Treasure = 2,
  Equipment = 3,
  Island = 4,
  Event = 5,
}

export type ExtendedCard<T extends Item> = Component<{
  item: T;
  actions?: JSX.Element;
}>;

export interface ItemCardProps<T extends Item> {
  type: string;
  actions?: JSX.Element;
  children: JSX.Element;
  link?: string;
  item: T;
  preview?: JSX.Element;
  moreInfo?: JSX.Element;
}

export function ItemCard<T extends Item>(props: ItemCardProps<T>) {
  return (
    <li
      classList={{
        item: true,
        [props.type]: true,
        dark: isDarkColor(props.item.extension.bgColor),
      }}
      style={{
        "--color": `#${props.item.extension.bgColor}`,
        "--bg": `url(${baseImg}/${props.item.extension.bg})`,
      }}
    >
      <div class="actions">
        {props.actions}
        {props.link && (
          <IconButton
            id="book-open"
            onClick={() => open(props.link, "_blank")}
            title="More info"
          />
        )}
      </div>
      <div class="info">
        <div class="main">
          {props.item.points && <div class="points">{props.item.points}</div>}

          <div class="name">{props.item.name}</div>

          <img
            class="extension"
            src={`${baseImg}/${props.item.extension.icon}`}
            alt={props.item.extension.name}
          />

          <span class="id">{`${props.item.extension.short} ${props.item.numid}`}</span>

          {props.item.faction && (
            <img
              class="faction"
              src={`${baseImg}/${props.item.faction.icon}`}
              alt={props.item.faction.name}
            />
          )}
        </div>
        <div class="extra collapse">
          <div class="preview">{props.preview}</div>
          {props.moreInfo}
          {props.item.aptitude && (
            <div class="aptitude">{props.item.aptitude}</div>
          )}
        </div>
      </div>
      {props.children}
      {props.item.rarity && (
        <div class="rarity">
          <div
            class="inner"
            style={{ "--color": `#${props.item.rarity.color}` }}
          ></div>
        </div>
      )}
    </li>
  );
}
