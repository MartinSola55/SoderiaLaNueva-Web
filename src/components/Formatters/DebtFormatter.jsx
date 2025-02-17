export const DebtFormatter = (value) => {
    if (value === 0)
        return <span>Sin deuda</span>

    const computedValue = Math.abs(value).toLocaleString('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    if (value < 0)
        return <span className="text-success">{`A favor: $${computedValue}`}</span>
    else if (value > 0)
        return <span className="text-danger">{`$${computedValue}`}</span>
};