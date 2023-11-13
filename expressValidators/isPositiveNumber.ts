const isPositiveNumber = (value: string) => {

    if (parseInt(value) > 0) {
        return true;
    }

    throw new Error('A positive number is expected.');
}

export default isPositiveNumber;