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
		products: [],
		subscriptions: [],
	};

	static StaticRoute = {
		dealerId: null,
		deliveryDay: 1,
	};

	static RouteDetails = {
		id: null,
		dealer: null,
		deliveryDay: null,
		carts: [],
		productTypes: [],
	};

	static RouteClients = {
		clients: [],
	};

	static CartFilters = {
		cartStatus: [],
		productType: [],
		cartTransfersType: [],
		cartPaymentStatus: [],
		cartServiceType: [],
	};

	static Cart = {
		id: null,
		deliveryDay: null,
		dealer: null,
		client: null,
		products: [],
		paymentMethods: [],
		subscriptionProducts: [],
		clientProducts: [],
	};

	static Product = {
		name: '',
		price: '',
		typeId: null,
	}

	static Transfer = {
		clientId: null,
		amount: 0,
	}
}
