import { describe, it, expect } from "vitest";
import { Roles } from "@constants/Roles";
import { formatComboItems, formatCurrency, formatRole, validateDecimal, validateInt } from "./Helpers";

describe('formatting', () => {
	it('should correctly format role names', () => {
		const admin = formatRole(Roles.Admin);
		const dealer = formatRole(Roles.Dealer);

		const expectedAdmin = 'Admin';
		const expectedDealer = 'Repartidor';

		expect(admin).toEqual(expectedAdmin);
		expect(dealer).toEqual(expectedDealer);
	});

	it('should correctly format combo items with id and stringId', () => {
		const intList = [
			{
				id: 1,
				description: 'Item 1',
			},
			{
				id: 2,
				description: 'Item 2',
			},
			{
				id: 3,
				description: 'Item 3',
			}
		];

		const stringList = [
			{
				stringId: '1',
				description: 'Item 1',
			},
			{
				stringId: '2',
				description: 'Item 2',
			},
			{
				stringId: '3',
				description: 'Item 3',
			}
		];

		const intItems = formatComboItems(intList);
		const stringItems = formatComboItems(stringList);

		const expectedInt = intList.map((item) => ({
			value: item.id,
			label: item.description,
		}));

		const expectedString = stringList.map((item) => ({
			value: item.stringId,
			label: item.description,
		}));

		expect(intItems).toEqual(expectedInt);
		expect(stringItems).toEqual(expectedString);
	});

	it('should correctly format currencies', () => {
		const total = formatCurrency(1500);
		const negativeTotal = formatCurrency(-1500);

		const expected = '$1.500,00';
		const expectedNegative = '-$1.500,00';

		expect(total).toEqual(expected);
		expect(negativeTotal).toEqual(expectedNegative);
	});
});

describe('validations', () => {
	it('should correctly validate an int', () => {
		const isInt = validateInt(1500);
		const isInt2 = validateInt('hello');

		expect(isInt).toEqual(true);
		expect(isInt2).toEqual(false);
	});

	it('should correctly validate a decimal', () => {
		const isDecimal = validateDecimal(1500.25);
		const isDecimal2 = validateDecimal('hello');

		expect(isDecimal).toEqual(true);
		expect(isDecimal2).toEqual(false);
	});
});