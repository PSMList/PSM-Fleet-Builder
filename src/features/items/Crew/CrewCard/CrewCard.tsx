import "./CrewCard.scss";

import { JSX } from "solid-js";

import { Crew } from "@/store/data/crew";
import { ItemCard } from "@/common/Item/ItemCard";
import { baseImg, baseUrl } from "@/utils/config";
import { LazyImg } from "@/common/LazyImg/LazyImg";

type CrewCardProps = {
  item: Crew;
  actions?: JSX.Element;
  children?: JSX.Element;
};

export function CrewCard(props: CrewCardProps) {
  return (
    <ItemCard
      type="crew"
      actions={props.actions}
      link={`${baseUrl}/crew/${props.item.extension.short}${props.item.numid}`}
      item={props.item}
      preview={
        <LazyImg
          class="preview"
          src={`${baseImg}/${props.item.img}`}
          alt=""
          width="80px"
          height="80px"
          altSrc={`${baseImg}/logos/crew.png`}
        />
      }
    >
      {props.children}
    </ItemCard>
  );
}
