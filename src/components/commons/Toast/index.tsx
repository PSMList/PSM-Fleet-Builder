import IconButton from "@/components/commons/IconButton";
import { capitalize } from "@/utils";
import { Accessor, JSX, Show } from "solid-js";


type ToastTypes = 'info' | 'success' | 'warning' | 'error';

const icons: { [K in ToastTypes]: string } = {
    info: 'info-circle',
    success: 'check-circle',
    warning: 'exclamation-triangle',
    error: 'exclamation-circle'
}

export type ToastPosition = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';

export type ToastType = {
    id: string
    type: ToastTypes
    title?: string
    description: string | JSX.Element
}

export type ToastProps = ToastType & {
    position: ToastPosition
    count: Accessor<number>
    deleteToast: (id: ToastType['id']) => void
}

const Toast = (props: ToastProps) => {
    const backgroundColor = (() => {
        switch (props.type) {
            case 'info':
                return '#5bc0de';
            case 'success':
                return '#5cb85c';
            case 'warning':
                return '#f0ad4e';
            case 'error':
                return '#d9534f';
        }
    })();
    
    if (!props.title) {
        props.title = capitalize(props.type);
    }

    return (
        <div
            class={`notification ${props.position}`}
            style={{ 'background-color': backgroundColor }}
        >
            <span class="notification-close">
                <IconButton
                    iconID="times"
                    onClick={() => props.deleteToast(props.id)}
                    title="Close"
                />
            </span>
            <i
                class={ "notification-image fas fa-" + icons[props.type] }
                title={ props.title }
            />
            <span class="notification-title">
                { props.title }
                <Show when={props.count() > 1}>
                    &nbsp;x{ props.count() }
                </Show>
            </span>
            <span class="notification-message">
                { props.description }
            </span>
        </div>
    );
}

export default Toast;