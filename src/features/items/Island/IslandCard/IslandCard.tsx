import "./IslandCard.scss";

import { JSX } from "solid-js";

import { Island } from "@/store/data/island";
import { ItemCard } from "@/common/Item/ItemCard";
import { baseImg, baseUrl } from "@/utils/config";
import { LazyImg } from "@/common/LazyImg/LazyImg";

type IslandCardProps = {
  item: Island;
  actions?: JSX.Element;
  children?: JSX.Element;
};

export function IslandCard(props: IslandCardProps) {
  return (
    <ItemCard
      type="island"
      actions={props.actions}
      link={`${baseUrl}/island/${props.item.slugname}`}
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
