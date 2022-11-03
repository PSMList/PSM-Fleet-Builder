import { capitalize } from "../../../utils";
import InfoIcon from '../../../assets/ToastIcons/info.svg';
import SuccessIcon from '../../../assets/ToastIcons/success.svg';
import WarningIcon from '../../../assets/ToastIcons/warning.svg';
import ErrorIcon from '../../../assets/ToastIcons/error.svg';
import IconButton from "../IconButton";


type ToastTypes = 'info' | 'success' | 'warning' | 'error';

const icons: { [K in ToastTypes]: string } = {
    info: InfoIcon,
    success: SuccessIcon,
    warning: WarningIcon,
    error: ErrorIcon
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
            <img src={ icons[type] } alt={ title } title={ title } className="notification-image" />
            <p className="notification-title">{title}</p>
            <p className="notification-message">
                {description}
            </p>
        </div>
    );
}

export default Toast;