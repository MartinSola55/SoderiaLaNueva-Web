export class InitialFormStates {
    static User = {
        fullName: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: null,
    };

    static Expense = { 
        dealerId: '',
        description: '',
        amount: 0 
    };

    static Subscription = {
        name: '',
        price: '',
        subscriptionProducts: [],
    };

    static Transfer = {
        amount: 0,
    }
}
