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

    static Client = {
        name: '',
        address: '',
        phone: '',
        observations: '',
        dealerId: null,
        deliveryDay: null,
        hasInvoice: false,
        invoiceType: null,
        taxCondition: null,
        cuit: '',
        products: []
    };

    static StaticRoute = {
        dealerId : null, 
        deliveryDay: 1, 
    }

    static Route = {
        clients: [], 
    }
}
