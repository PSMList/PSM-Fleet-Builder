import "./ShipCard.scss";

import { For, JSX } from "solid-js";

import { ItemCard } from "@/common/Item/ItemCard";
import { ShipItem } from "@/store/data/ship";
import { baseImg, baseSvg, baseUrl } from "@/utils/config";
import { LazyImg } from "@/common/LazyImg/LazyImg";

interface ShipCardProps {
  item: ShipItem;
  actions?: JSX.Element;
  children?: JSX.Element;
}

export function ShipCard(props: ShipCardProps) {
  return (
    <ItemCard
      type="ship"
      actions={props.actions}
      link={`${baseUrl}/ship/${props.item.extension.short}${props.item.numid}`}
      item={props.item}
      preview={
        <LazyImg
          class="preview"
          src={`${baseImg}/${props.item.img}`}
          alt=""
          width="80px"
          height="80px"
          altSrc={`${baseImg}/technicalshape/icon/${props.item.technicalshape}.jpg`}
        />
      }
      moreInfo={
        <>
          <div class="stats">
            <span class="masts">
              <img src={`${baseSvg}/masts_nobg.svg`} />
              {props.item.masts}
            </span>

            {isFinite(props.item.cargo) && (
              <span class="cargo">
                <img src={`${baseSvg}/cargo_nobg.svg`} />
                {props.item.cargo}
              </span>
            )}

            {props.item.basemove && (
              <span class="basemove">
                <img src={`${baseSvg}/basemove_nobg.svg`} />
                {/* add color by changing L to <span class="L">L</span> */}
                {props.item.basemove
                  .match(/./g)
                  ?.map((move) =>
                    move === "L" ? <span class="L">L</span> : move,
                  )}
              </span>
            )}
          </div>

          <div class="cannons">
            <img src={`${baseSvg}/cannons.svg`} />
            <For each={props.item.cannons.match(/.{2}/g)}>
              {(cannon) => (
                <img src={`${baseSvg}/dice/${cannon}.svg`} alt={cannon} />
              )}
            </For>
          </div>
        </>
      }
    >
      {props.children}
    </ItemCard>
  );
}
