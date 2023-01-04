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
    children: JSX.Element
};

export const Item = (props: ItemProps) => {
    const children = <>{ props.children }</>;
    return (
        <li class="item">
            <div class="actions">{ props.actions }</div>
            <div class="item_background">
            </div>
            { children }
        </li>
    );
}

export default Item;