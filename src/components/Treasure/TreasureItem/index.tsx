import { JSX, Show } from "solid-js";
import IconButton from "@/components/commons/IconButton";
import Item from "@/components/commons/Item";
import { TreasureType } from "@/data/treasure";
import "./TreasureItem.css";
import { onError, setBackground } from "@/utils";
import { baseUrl } from "@/App";

interface SearchItemProps {
  data: TreasureType;
  actions?: JSX.Element;
  collapse?: boolean;
}

const TreasureItem = (props: SearchItemProps) => {
  return (
    <Item
      actions={
        <>
          {props.actions}
          <IconButton
            iconID="book-open"
            onClick={() =>
              open(
                `${baseUrl}/treasure/${props.data.extension.short}${props.data.numid}`,
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
            src={`${baseUrl}/${props.data.extension.icon}`}
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

export default TreasureItem;
