const format = (number) => {
    return new Intl.NumberFormat().format(number).replace(/,/g, ', ')
}

export default format
