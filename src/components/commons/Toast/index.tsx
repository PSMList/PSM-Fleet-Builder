import IconButton from "@/components/commons/IconButton";
import { capitalize } from "@/utils";


type ToastTypes = 'info' | 'success' | 'warning' | 'error';

const icons: { [K in ToastTypes]: string } = {
    info: 'info-circle',
    success: 'check-circle',
    warning: 'exclamation-triangle',
    error: 'exclamation-circle'
}

export type ToastPosition = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';

export type ToastType = {
    type: ToastTypes
    title?: string
    description: string
}

export type ToastProps = ToastType & {
    id: number
    position: ToastPosition
    deleteToast: (id: number) => void
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
            <IconButton iconID="times" onClick={() => props.deleteToast(props.id)} />
            <i class={ "notification-image fas fa-" + icons[props.type] } title={ props.title } />
            <p class="notification-title">{props.title}</p>
            <p class="notification-message">
                {props.description}
            </p>
        </div>
    );
}

export default Toast;