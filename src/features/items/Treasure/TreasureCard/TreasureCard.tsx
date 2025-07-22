import "./TreasureCard.scss";

import { JSX } from "solid-js";

import { Treasure } from "@/store/data/treasure";
import { ItemCard } from "@/common/Item/ItemCard";
import { baseImg, baseUrl } from "@/utils/config";
import { LazyImg } from "@/common/LazyImg/LazyImg";

type TreasureCardProps = {
  item: Treasure;
  actions?: JSX.Element;
  children?: JSX.Element;
};

export function TreasureCard(props: TreasureCardProps) {
  return (
    <ItemCard
      type="treasure"
      actions={props.actions}
      link={`${baseUrl}/treasure/${props.item.extension.short}${props.item.numid}`}
      item={props.item}
      preview={
        <LazyImg
          class="preview"
          src={`${baseImg}/${props.item.img}`}
          alt=""
          width="80px"
          height="80px"
        />
      }
    >
      {props.children}
    </ItemCard>
  );
}
