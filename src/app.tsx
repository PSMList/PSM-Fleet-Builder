import { ModalRoot } from "@/components/commons/Modal";
import Toasts from "@/components/commons/Toasts";
import Ship from "@/components/Ship";
import './App.css';

export const onlyDisplay = !/self\/show\/\d+\/[^/]+$/.test(window.location.pathname);
export const fleetMaxpointsMin = 30;
export const fleetMaxpointsMax = 200;
export const baseUrl = `${window.location.origin}/public`;
// export const fleetMaxpointsMin = window.fleetMaxpointsMin;
// export const fleetMaxpointsMax = window.fleetMaxpointsMax;
// export const baseUrl = window.baseUrl;

export function App() {

  return (
    <>
      <Toasts position='top-right' autoDeleteTime={ 8000 } />
      <ModalRoot />
      <Ship />
    </>
  );
}