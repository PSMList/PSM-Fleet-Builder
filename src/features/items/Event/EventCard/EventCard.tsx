import "./EventCard.scss";

import { JSX } from "solid-js";

import { EventItem } from "@/store/data/event";
import { ItemCard } from "@/common/Item/ItemCard";
import { baseImg, baseUrl } from "@/utils/config";
import { LazyImg } from "@/common/LazyImg/LazyImg";

type EventCardProps = {
  item: EventItem;
  actions?: JSX.Element;
  children?: JSX.Element;
};

export function EventCard(props: EventCardProps) {
  return (
    <ItemCard
      type="event"
      actions={props.actions}
      link={`${baseUrl}/event/${props.item.extension.short}${props.item.numid}`}
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
