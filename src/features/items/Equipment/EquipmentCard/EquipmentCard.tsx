import "./EquipmentCard.scss";

import { JSX } from "solid-js";

import { Equipment } from "@/store/data/equipment";
import { ItemCard } from "@/common/Item/ItemCard";
import { baseImg, baseUrl } from "@/utils/config";
import { LazyImg } from "@/common/LazyImg/LazyImg";

type EquipmentCardProps = {
  item: Equipment;
  actions?: JSX.Element;
  children?: JSX.Element;
};

export function EquipmentCard(props: EquipmentCardProps) {
  return (
    <ItemCard
      type="equipment"
      actions={props.actions}
      link={`${baseUrl}/equipment/${props.item.extension.short}${props.item.numid}`}
      item={props.item}
      preview={
        <LazyImg
          class="preview"
          src={`${baseImg}/${props.item.img}`}
          alt=""
          width="80px"
          height="80px"
          altSrc={`${baseImg}/logos/noimg.png`}
        />
      }
    >
      {props.children}
    </ItemCard>
  );
}
