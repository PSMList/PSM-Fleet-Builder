import { JSX } from 'preact/jsx-runtime';
import './Items.css';

const Items = ( props: JSX.IntrinsicAttributes & JSX.HTMLAttributes<HTMLUListElement> ) => (
    <ul { ...props } className={ 'items' + (props.className ? ' ' + props.className : '') }>
        { props.children }
    </ul>
);

export default Items;