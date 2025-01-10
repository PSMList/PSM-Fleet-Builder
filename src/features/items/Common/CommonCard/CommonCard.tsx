import "./CommonCard.scss";

import { JSX } from "solid-js";

import { Item, ItemCard, ItemType } from "@/common/Item/ItemCard";
import { baseImg, baseUrl } from "@/utils/config";
import { LazyImg } from "@/common/LazyImg/LazyImg";
import { Island } from "@/store/data/island";

type CommonCardProps = {
  item: Item;
  type: ItemType;
  actions?: JSX.Element;
  children?: JSX.Element;
};

export function CommonCard(props: CommonCardProps) {
  const id =
    props.type !== "island"
      ? `${props.item.extension.short}${props.item.numid}`
      : (props.item as Island).slugname;

  const noImg = props.type === "crew" ? "crew" : "noimg";

  return (
    <ItemCard
      type={props.type}
      actions={props.actions}
      link={`${baseUrl}/${props.type}/${id}`}
      item={props.item}
      preview={
        <LazyImg
          class="preview"
          src={`${baseImg}/${props.item.img}`}
          alt=""
          width="80px"
          height="80px"
          altSrc={`${baseImg}/logos/${noImg}.png`}
        />
      }
    >
      {props.children}
    </ItemCard>
  );
}
