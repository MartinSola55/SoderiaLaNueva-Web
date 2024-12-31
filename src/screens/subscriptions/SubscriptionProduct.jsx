export const SubscriptionProduct = ({ products = [] }) => {
    return products.map((product, idx) => (
        <ul key={idx}>
            <li>
                {product.name} x {product.quantity} u.
            </li>
        </ul>
    ));
};
