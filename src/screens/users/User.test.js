import { describe, it, expect } from "vitest";
import { validateUser } from "./User.helpers";
import { Roles } from "@constants/Roles";

const user = {
	fullName: 'Test',
	email: 'test@test.com',
	password: '',
	phoneNumber: '1234567890',
	role: Roles.Dealer,
};


describe('validations', () => {
	it('should correctly create a user', () => {
		const passWordUser = {
			...user,
			password: '123456',
		};

		const error = validateUser(user, false, false);
		const noError = validateUser(passWordUser, false, false);

		expect(error).toEqual(false);
		expect(noError).toEqual(true);
	});
});