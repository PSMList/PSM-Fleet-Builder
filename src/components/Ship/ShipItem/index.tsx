import IconButton from "@/components/commons/IconButton";
import Item from "@/components/commons/Item";
import { ShipType } from "@/data/ship";
import { For, JSX, Show } from "solid-js";
import "./ShipItem.css";

type SearchItemProps = {
  data: ShipType;
  actions?: JSX.Element;
};

function onError(this: any, target: HTMLImageElement, url: string) {
  target.src = url;
  target.onerror = null;
}

function setBackground(element: HTMLDivElement, short: string) {
  if (element.parentElement) {
    element.parentElement.style.backgroundImage = `url(${window.baseUrl}/img/bg_card/m/bg_${short}.png)`;
  }
}

const ShipItem = (props: SearchItemProps) => {
  return (
    <Item
      actions={
        <>
          {props.actions}
          <IconButton
            iconID="book-open"
            onClick={() => open(`${window.baseUrl}/ship/${props.data.extension.short}${props.data.numid}`, "_blank")}
            title="More info"
          />
        </>
      }
      color={props.data.extension.colorhex}
    >
      <div
        class="info"
        ref={(ref) => setTimeout(() => setBackground(ref, props.data.extension.short.replace(/U$/, "")), 1)}
      >
        <div class="top">
          <div class="points">{props.data.points}</div>
          <div class="name">{props.data.name}</div>
          <img
            class="extension"
            src={`${window.baseUrl}/img/logos/logo_${props.data.extension.short.replace(/U$/, "")}_o.png`}
            alt={props.data.faction.defaultname}
          />
          <span class="id">{`${props.data.extension.short} ${props.data.numid}`}</span>
          <img
            class="faction"
            src={`${window.baseUrl}/img/flag/flat/normal/${props.data.faction.nameimg}.png`}
            alt={props.data.faction.defaultname}
          />
        </div>
        <div class="bottom">
          <img
            class="preview"
            loading="lazy"
            src={props.data.img}
            alt={props.data.fullname}
            width="80"
            height="80"
            onerror={({ target }) => onError(target as HTMLImageElement, props.data.altimg)}
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
              {props.data.basemove.match(/./g)?.map((move) => (move === "L" ? <span class="L">L</span> : move))}
            </span>
          </span>
          <span class="cannons">
            <img src={`${window.baseUrl}/img/svg/cannons.svg`} />
            <For each={props.data.cannons.match(/.{2}/g)}>
              {(cannon) => <img src={`${window.baseUrl}/img/svg/dice/${cannon}.svg`} alt="■" />}
            </For>
          </span>
          <span class="aptitude">{props.data.defaultaptitude}</span>
        </div>
      </div>
      <Show when={props.data.crew.length > 0}>
        <ul class="crew">
          <For each={props.data.crew}>
            {(crew) => (
              <li>
                <span class="points">{crew.points}</span>&nbsp;
                <img
                  class="faction"
                  src={`${window.baseUrl}/img/flag/flat/normal/${crew.faction.nameimg}.png`}
                  alt={crew.faction.defaultname}
                />
                &nbsp;
                <span class="name">{crew.fullname}</span>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </Item>
  );
};

export default ShipItem;
