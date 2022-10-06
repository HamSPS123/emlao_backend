/* eslint-disable prettier/prettier */
export const decimalToJson = (value: any) => {
    if (value !== null && typeof value === 'object') {
        if (value.constructor.name === 'Decimal128') {
            return parseFloat(value.toString());
        }
    }

    return value;
}