

export function removeItemFromArray<T>(array: Array<T>, func: (value: T, index: number, obj: Array<T>) => boolean) {
    const index = array.findIndex( func );
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