import { For, JSX, Show } from "solid-js";
import IconButton from "@/components/commons/IconButton";
import Item from "@/components/commons/Item";
import { ShipType } from "@/data/ship";
import "./ShipItem.css";
import { onError, setBackground } from "@/utils";

interface SearchItemProps {
  data: ShipType;
  actions?: JSX.Element;
  collapse?: boolean;
}

const ShipItem = (props: SearchItemProps) => {
  return (
    <Item
      actions={
        <>
          {props.actions}
          <IconButton
            iconID="book-open"
            onClick={() =>
              window.open(
                `${window.baseUrl}/ship/${props.data.extension.short}${props.data.numid}`,
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
            alt={props.data.faction.defaultname}
          />
          <span class="id">{`${props.data.extension.short} ${props.data.numid}`}</span>
          <img
            class="faction"
            src={`${window.baseUrl}/${props.data.faction.icon}`}
            alt={props.data.faction.defaultname}
          />
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
            <span class="stats">
              <span class="masts">
                <img src={`${window.baseUrl}/img/svg/masts_nobg.svg`} />
                {props.data.masts}
              </span>
              <span class="cargo">
                <img src={`${window.baseUrl}/img/svg/cargo_nobg.svg`} />
                {props.data.cargo}
              </span>
              {/* add color by changing L to <span class="L">L</span> */}
              <span class="basemove">
                <img src={`${window.baseUrl}/img/svg/basemove_nobg.svg`} />
                {props.data.basemove
                  .match(/./g)
                  ?.map((move) =>
                    move === "L" ? <span class="L">L</span> : move
                  )}
              </span>
            </span>
            <span class="cannons">
              <img src={`${window.baseUrl}/img/svg/cannons.svg`} />
              <For each={props.data.cannons.match(/.{2}/g)}>
                {(cannon) => (
                  <img
                    src={`${window.baseUrl}/img/svg/dice/${cannon}.svg`}
                    alt="■"
                  />
                )}
              </For>
            </span>
            <span class="aptitude">{props.data.defaultaptitude}</span>
          </div>
        </Show>
      </div>
      <Show when={props.data.crew.length > 0}>
        <ul class="crew">
          <Show
            when={!props.collapse}
            fallback={
              <li>
                <span>{props.data.crew.length} crew</span>
              </li>
            }
          >
            <For each={props.data.crew}>
              {(crew) => (
                <li>
                  <span class="points">{crew.points}</span>&nbsp;
                  <img
                    class="faction"
                    src={`${window.baseUrl}/${crew.faction.icon}`}
                    alt={crew.faction.defaultname}
                  />
                  &nbsp;
                  <span class="name">{crew.fullname}</span>
                </li>
              )}
            </For>
          </Show>
        </ul>
      </Show>
    </Item>
  );
};

export default ShipItem;
