const isWord = (value: string) => {
    if (value.split(' ').length > 1) {
        throw new Error('Value must be a single word');
    }

    return true;
}

export default isWord;