const ranges = [{
    divider: 1E3,
    suffix: 'K',
}, {
    divider: 1E6,
    suffix: 'M',
}, {
    divider: 1E9,
    suffix: 'B',
}];


const Utils = Object.freeze({
    NumberFormatWithLetter: (input) => {
        for (let index = ranges.length - 1; index >= 0; index--) {
            if (input > ranges[index].divider) {
                let quotient = input / ranges[index].divider;

                if (quotient < 10) {
                    quotient = Math.floor(quotient * 10) / 10;
                }
                else {
                    quotient = Math.floor(quotient);
                }

                return quotient.toString() + ranges[index].suffix;
            }
        }

        return input.toString();
    },
});

module.exports = { Utils };