import './App.css';
import { ModalRoot } from './components/commons/Modal';
import Toasts from './components/commons/Toasts';
import Ship from './components/Ship';

export const onlyDisplay = !/self\/show\/\d+\/[^/]+$/.test(window.location.pathname);

export function App() {

  return (
    <>
      <Toasts position='bottom-right' autoDeleteTime={ 8000 } />
      <ModalRoot />
      <Ship />
    </>
  );
}