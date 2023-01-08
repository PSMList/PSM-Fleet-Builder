import { ExtensionType } from "@/data/extension";
import { FactionType } from "@/data/faction";
import { RarityType } from "@/data/rarity";
import { JSX } from "solid-js";
import './Item.css';

export type ItemType = {
    id: number
    img: string
    altimg: string
    faction: FactionType
    rarity: RarityType
    extension: ExtensionType
    name: string
    numid: string
    fullname: string
    points: number
    defaultaptitude: string
}

export type ItemsContextType<T extends ItemType> = {
    add: (item: T) => void
};

export type ItemProps = {
    actions?: JSX.Element
    color: string
    children: JSX.Element
};

export const Item = (props: ItemProps) => {
    return (
        <li class="item">
            <div class="actions" style={{ "border-color": `#${props.color}` }}>{ props.actions }</div>
            { props.children }
        </li>
    );
}

export default Item;