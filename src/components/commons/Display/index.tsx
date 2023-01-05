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
                <div class="title">{ props.title }</div>
                <Show when={ props.info }>
                    { props.info }
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