export const arrayImmutable = {
    update<T>(array: T[], index: number, newValue: T) {
        const newArray = array.slice();
        newArray[index] = newValue;
        return newArray;
    },

    push<T>(array: T[], value: T) {
        const newArray = array.slice();
        newArray.push(value);
        return newArray;
    },

    pop<T>(array: T[]): [T[], T] {
        const newArray = array.slice();
        return [newArray, newArray.pop()];
    }
};
