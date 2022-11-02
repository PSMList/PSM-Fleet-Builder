import { JSX } from 'preact/jsx-runtime';
import { ExtensionType } from '../../../data/extension';
import { FactionType } from '../../../data/faction';
import './Item.css';

export type ItemType = {
    id: number
    img: string
    altimg: string
    extension: ExtensionType
    faction: FactionType
    name: string
    numid: string
    fullname: string
    points: number
}

export type ItemsContextType = {
    selectItemCallbacks: Function[]
};

export type ItemProps = {
    actions?: JSX.Element
    children: JSX.Element
};

export const Item = ({ actions, children }: ItemProps) => (
    <li class="item">
        <div class="actions">{ actions }</div>
        <div class="item_background">
            { children }
        </div>
    </li>
);

export default Item;