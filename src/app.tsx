import './App.css';
import { ModalRoot } from './components/commons/Modal';
import Toasts from './components/commons/Toasts';
import Ship from './components/Ship';

export function App() {

  return (
    <>
      <Toasts position='bottom-right' autoDeleteTime={ 8000 } />
      <ModalRoot />
      <Ship />
    </>
  );
}