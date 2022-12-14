import Items from "@/components/commons/Items";
import { JSX, Show } from "solid-js";
import './Display.css';

type DisplayProps = {
    title?: string | JSX.Element
    info?: JSX.Element
    actions?: JSX.Element
    items: JSX.Element
}

const Display = (props: DisplayProps) => {

    return (
        <div class="display_container whitebox">
            <div class="display_header">
                <h2 class="title">{ props.title }</h2>
                <Show when={ props.info }>
                    <h3 class="info">{ props.info }</h3>
                </Show>
            </div>
            <div class="display_actions actions">{ props.actions }</div>
            <Items class="display_grid">
                { props.items }
            </Items>
        </div>
    );
}

export default Display;