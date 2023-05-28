function swap<T>(arr: T[], i: number, j: number) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export function getRandomInteger(N: number) {
    return Math.floor(Math.random() * N);
}

export function shuffle<T>(arr: T[]): T[] {
    for (let i = 1; i < arr.length; ++i) {
        swap(arr, i, getRandomInteger(i + 1));
    }
    return arr;
}

export function randomIntegerArray(length: number) {
    const arr = [...Array(length)].map((e, i) => i);
    return shuffle(arr);
}
