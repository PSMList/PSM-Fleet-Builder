import { JSX } from 'preact/jsx-runtime';
import Items from '../Items';
import './Display.css';

type DisplayProps = {
    title?: string | JSX.Element
    info?: JSX.Element
    actions?: JSX.Element
    items: JSX.Element[]
}

const Display = ({ title, actions, items, info }: DisplayProps) => {

    return (
        <div class="display_container whitebox">
            <div class="display_header">
                <h2 class="title">{ title }</h2>
                { info && <h3 class="info">{ info }</h3> }
            </div>
            <div class="display_actions actions">{ actions }</div>
            <Items className="display_grid">
                { items }
            </Items>
        </div>
    );
}

export default Display;