module.exports = {
    dialog: {
        name: 'shopCmd',
        embedColor: '#C600FF',
        step1: {
            name: 'Nora',
            message: 'You again?\nCome to bother me again?',
            options: {
                option1: {
                    text: 'I\'m here to buy',
                    emoji: '🛒',
                },
            },
        },
        step2option1: {
            name: 'Nora',
            message: 'I have these things',
            specialFunction: {
                openShop: true,
            },
        },
    },
};