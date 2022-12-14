import Item from "@/components/commons/Item";
import { ShipItemType } from "@/components/Ship";
import { JSX } from "solid-js";
import './ShipItem.css';

type SearchItemProps = {
    data: ShipItemType
    actions?: JSX.Element
}

const ShipItem = (props: SearchItemProps) => {

    return (
        <Item actions={ props.actions }>
            <div class="ship_info">
                <img width="50" height="50" loading="lazy" class="ship_preview" src={ props.data.img } alt="" />
                <span class="ship_title">
                    <div class="ship_id">{ props.data.extension.short + props.data.numid }</div>
                    <div class="ship_name">{ props.data.name }</div>
                </span>
                <img loading="lazy" class="faction_img" src={ props.data.faction.img } />
                <span class="ship_points"><i class="fas fa-coins" /><b> { props.data.points }</b></span>
                <span class="ship_cargo"><img src="/public/img/svg/cargo_nobg.svg" /><b> { props.data.cargo }</b></span>
                <span class="ship_"></span>
            </div>
        </Item>
    );
}

export default ShipItem;