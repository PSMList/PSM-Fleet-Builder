import { useRef, useState, useEffect } from "preact/hooks";

// source : https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e
export const useEffectOnce = (effect: () => void | (() => void)) => {
    const destroyFunc = useRef<void | (() => void)>();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [val, setVal] = useState<number>(0);

    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }

    useEffect(() => {
        // only execute the effect first time around
        if (!effectCalled.current) {
            destroyFunc.current = effect();
            effectCalled.current = true;
        }

        // this forces one render after the effect is run
        setVal((val) => val + 1);

        return () => {
            // if the comp didn't render since the useEffect was called,
            // we know it's the dummy React cycle
            if (!renderAfterCalled.current) {
                return;
            }
            if (destroyFunc.current) {
                destroyFunc.current();
            }
        };
    }, []);
};

export function removeItemFromArray<T>(array: Array<T>, func: (value: T, index: number, obj: Array<T>) => boolean) {
    const index = array.findIndex(func);
    if (index !== -1) {
        return array.splice(index, 1);
    }
}

export function isStrPositiveInt(str: string) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

export function capitalize(value: string) {
    return value.charAt(0).toLocaleUpperCase() + value.slice(1)
}