import { capitalize } from "../../../utils";
import IconButton from "../IconButton";


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

const Toast = ({ id, type, position, title, description, deleteToast }: ToastProps) => {
    const backgroundColor = (() => {
        switch (type) {
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
    
    if (!title) {
        title = capitalize(type);
    }

    return (
        <div
            className={`notification ${position}`}
            style={{ backgroundColor: backgroundColor }}
        >
            <IconButton iconID="times" onClick={() => deleteToast(id)} />
            <i class={ "notification-image fas fa-" + icons[type] } alt={ title } title={ title } />
            <p className="notification-title">{title}</p>
            <p className="notification-message">
                {description}
            </p>
        </div>
    );
}

export default Toast;