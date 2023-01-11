function swap(arr: any[], i: number, j: number) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function getRandomInteger(N: number) {
    return Math.floor(Math.random() * N);
}

function randomIntegerArray(length: number) {
    const randomArray = [...Array(length)].map((e, i) => i);
    for (let i = 1; i < length; ++i) {
        swap(randomArray, i, getRandomInteger(i + 1));
    }
    return randomArray;
}

export { randomIntegerArray };
