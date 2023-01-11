export function arrayUpdate<T>(array: T[], index: number, newValue: T) {
    const newArray = array.slice();
    newArray[index] = newValue;
    return newArray;
}

export function arrayPush<T>(array: T[], value: T) {
    const newArray = array.slice();
    newArray.push(value);
    return newArray;
}

export function arrayPop<T>(array: T[]): [T[], T] {
    const newArray = array.slice();
    return [newArray, newArray.pop()];
}
