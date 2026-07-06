import { faker } from "@faker-js/faker";

export function getRandomElements(array, options) {
    const amount = options?.amount ?? 1;
    if (array.length === 0) {
        throw new Error("Array cannot be empty");
    }
    if (amount > array.length) {
        throw new Error("Amount cannot be greater than the array length");
    }
    const elements = [];
    const usedIndices = new Set();
    while (elements.length < amount) {
        const randomIndex = faker.number.int({ min: 0, max: array.length });
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            elements.push(array[randomIndex]);
        }
    }
    return elements;
}

export function getRandomElement(array) {
    return getRandomElements(array)[0];
}

