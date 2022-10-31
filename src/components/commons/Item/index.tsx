import { JSX } from 'preact/jsx-runtime';
import { ExtensionType } from '../../../extensionData';
import { FactionType } from '../../../factionData';
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

export const Item = ({ actions, children }: ItemProps) => {
    
    return (
        <li class="item">
            <div class="actions">{ actions }</div>
            <div class="item_background">
                { children }
            </div>
        </li>
    )
}

export default Item;