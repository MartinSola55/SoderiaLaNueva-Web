export const AddressFormatter = (address) => {
    if (address && address.road && address.houseNumber) {
        return `${address.road} ${address.houseNumber}`;
    }
    return '';
}
