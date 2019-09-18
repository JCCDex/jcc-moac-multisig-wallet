export const isValidLockedAmount = (value: number): boolean => {
    return Number.isInteger(value) && value > 0 && value % 1000 === 0;
}