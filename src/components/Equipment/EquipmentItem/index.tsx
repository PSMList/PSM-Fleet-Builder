import { JSX, Show } from "solid-js";
import IconButton from "@/components/commons/IconButton";
import Item from "@/components/commons/Item";
import { EquipmentType } from "@/data/equipment";
import "./EquipmentItem.css";
import { onError, setBackground } from "@/utils";

interface SearchItemProps {
  data: EquipmentType;
  actions?: JSX.Element;
  collapse?: boolean;
}

const EquipmentItem = (props: SearchItemProps) => {
  return (
    <Item
      actions={
        <>
          {props.actions}
          <IconButton
            iconID="book-open"
            onClick={() =>
              open(
                `${window.baseUrl}/equipment/${props.data.extension.short}${props.data.numid}`,
                "_blank"
              )
            }
            title="More info"
          />
        </>
      }
      color={props.data.extension.colorhex}
    >
      <div
        class="info"
        ref={(ref) =>
          setTimeout(() => setBackground(ref, props.data.extension.bg), 1)
        }
      >
        <div class="top">
          <div class="points">{props.data.points}</div>
          <div class="name">{props.data.name}</div>
          <img
            class="extension"
            src={`${window.baseUrl}/${props.data.extension.icon}`}
            alt={props.data.extension.short}
          />
          <span class="id">{`${props.data.extension.short} ${props.data.numid}`}</span>
        </div>
        <Show when={!props.collapse}>
          <div class="bottom">
            <img
              class="preview"
              loading="lazy"
              src={props.data.img}
              alt={props.data.fullname}
              width="80"
              height="80"
              onError={({ target }) =>
                onError(target as HTMLImageElement, props.data.altimg)
              }
            />
            <span class="aptitude">{props.data.defaultaptitude}</span>
          </div>
        </Show>
      </div>
    </Item>
  );
};

export default EquipmentItem;
