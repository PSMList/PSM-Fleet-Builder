import { ModalRoot } from "@/components/commons/Modal";
import Toasts from "@/components/commons/Toasts";
import Ship from "@/components/Ship";
import "@/App.css";
import { JSX, createContext, createSignal, useContext } from "solid-js";
import { StoreProvider } from "@/data/store";

declare global {
  interface Window {
    fleetMaxpointsMin: number;
    fleetMaxpointsMax: number;
    fleetNameMinlength: number;
    fleetNameMaxlength: number;
    baseUrl: string;
  }
}

export const [, self, hash, slug] = location.pathname.match(
  /(self\/)?show\/(\d+)\/([^/]+)$/
) ?? ["", "", "", ""];
export const onlyDisplay = !self;
export const baseUrl = window.baseUrl;

interface CardCollapseContextProps {
  children?: JSX.Element;
  collapse?: boolean;
}

function setDefaultCardsCollapseContext(_collapse?: boolean) {
  const [collapse, setCollapse] = createSignal(_collapse ?? false);
  return [
    collapse,
    {
      toggle: () => {
        setCollapse((_collapse) => !_collapse);
      },
    },
  ] as const;
}

export const CardCollapseContext = createContext(
  setDefaultCardsCollapseContext()
);

export const CardsCollapseProvider = (props: CardCollapseContextProps) => {
  const collapse = () => props.collapse;
  const value = setDefaultCardsCollapseContext(collapse());
  return (
    <CardCollapseContext.Provider value={value}>
      {props.children}
    </CardCollapseContext.Provider>
  );
};

export const useCardsCollapse = () => useContext(CardCollapseContext);

export function App() {
  return (
    <StoreProvider>
      <Toasts position="top-right" autoDeleteTime={5000} />
      <ModalRoot />
      <Ship />
    </StoreProvider>
  );
}
