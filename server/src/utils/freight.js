const totalWeight = (items) => {
    return items.reduce((acc, item) => acc + parseFloat(item.weight), 0)
}

const totalDimensions = (items) => {
    return items.reduce((acc, item) => {
        const quantity = parseFloat(item.quantity) || 1
        return (
            acc +
            (parseFloat(item.length) *
                parseFloat(item.width) *
                parseFloat(item.height) *
                quantity) /
                1000
        )
    }, 0)
}

const price = (items) => {
    let amount = totalWeight(items) * totalDimensions(items)
    if (!amount) return 0
    return amount
}

export { totalWeight, price }
