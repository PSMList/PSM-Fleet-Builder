import Item from "@/components/commons/Item";
import { CrewItemType } from "@/components/Crew";
import { JSX } from "solid-js";
import './CrewItem.css';

type SearchItemProps = {
    data: CrewItemType
    actions?: JSX.Element
}

const CrewItem = (props: SearchItemProps) => () => {

    return (
        <Item actions={ props.actions }>
            <div class="crew_info">
                <img class="crew_preview" loading="lazy" src={ props.data.img } onError={ (event) => (event.target as HTMLImageElement).src = props.data.altimg } />
                <span class="crew_title">
                    <div class="crew_id">{ props.data.extension.short + props.data.numid }</div>
                    <div class="crew_name">{ props.data.name }</div>
                </span>
                <img class="faction_img" loading="lazy" src={ props.data.faction.img } />
                <span class="crew_points"><i class="fas fa-coins" /><b> { props.data.points }</b></span>
            </div>
        </Item>
    );
}

export default CrewItem;