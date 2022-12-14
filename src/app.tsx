import { ModalRoot } from "@/components/commons/Modal";
import Toasts from "@/components/commons/Toasts";
import Ship from "@/components/Ship";
import { Show } from "solid-js";
import './App.css';

export const [hash, slug] = window.location.pathname.split('/').splice(-2, 2);
export const onlyDisplay = !/self\/show\/\d+\/[^/]+$/.test(window.location.pathname);
export const fleetMaxpointsMin = window.fleetMaxpointsMin;
export const fleetMaxpointsMax = window.fleetMaxpointsMax;
export const baseUrl = window.baseUrl;

declare global {
  interface Window {
    fleetMaxpointsMin: number
    fleetMaxpointsMax: number
    fleetNameMinlength: number
    fleetNameMaxlength: number
    baseUrl: string
  }
}

export function App() {

  return (
    <>
      <Toasts position='top-right' autoDeleteTime={ 8000 } />
      <ModalRoot />
      <Ship />
    </>
  );
}