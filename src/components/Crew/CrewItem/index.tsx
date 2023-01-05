import { baseUrl } from "@/App";
import IconButton from "@/components/commons/IconButton";
import Item from "@/components/commons/Item";
import { CrewType } from "@/data/crew";
import { JSX } from "solid-js";
import './CrewItem.css';

type SearchItemProps = {
    data: CrewType
    actions?: JSX.Element
}

function onError(this: any, target: HTMLImageElement, url: string) {
    target.src = url;
    target.onerror = null;
}

function setBackground(element: HTMLDivElement, short: string) {
    if (element.parentElement) {
        element.parentElement.style.backgroundImage = `url(${baseUrl}/img/bg_card/m/bg_${short}.png)`;
    }
}

const CrewItem = (props: SearchItemProps) => () => {
    
    return (
        <Item
            actions={<>
                { props.actions }
                <IconButton
                    iconID="book-open"
                    onClick={
                        () => open(`${baseUrl}/crew/${props.data.extension.short}${props.data.numid}`, '_blank')
                    }
                    title="More info"
                />
            </>}
        >
            <div class="info" ref={ (ref) => setTimeout(() => setBackground(ref, props.data.extension.short.replace('U', '')), 1) }>
                <div class="top">
                    <div class="points">{ props.data.points }</div>
                    <div class="name">{ props.data.name }</div>
                    <img class="extension" src={ `${baseUrl}/img/logos/logo_${props.data.extension.short.replace('U', '')}_o.png` } alt={ props.data.faction.defaultname } />
                    <span class="id">{ `${props.data.extension.short} ${props.data.numid}` }</span>
                    <img class="faction" src={ `${baseUrl}/img/flag/search/${props.data.faction.nameimg}.png` } alt={ props.data.faction.defaultname } />
                </div>
                <div class="bottom">
                    <img class="preview" loading="lazy" src={ props.data.img } alt={ props.data.fullname } width="80" height="80"
                        onerror={ ({ target }) => onError(target as HTMLImageElement, props.data.altimg) } />
                    <span class="aptitude">{ props.data.defaultaptitude }</span>
                </div>
            </div>
        </Item>
    );
}

export default CrewItem;