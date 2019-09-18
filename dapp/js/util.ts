export const isValidAmount = (value: number): boolean => {
    return Number.isFinite(value) && !Number.isNaN(value) && value >= 0;
}