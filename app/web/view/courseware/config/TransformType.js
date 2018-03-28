const transformConfig = {
    common: {
        up: true,
        right: true,
        bottom: true,
        left: true,
        fastOption: true,
        questionNum: false
    },
    table: {
        up: false,
        right: true,
        bottom: false,
        left: true,
        fastOption: true,
        questionNum: false
    },
    group: {
        up: false,
        right: false,
        bottom: false,
        left: false,
        fastOption: true,
        questionNum: true
    },
    text: {
        up: false,
        right: true,
        bottom: false,
        left: true,
        fastOption: true,
        questionNum: false
    },
    member: { // 习题框内的block
        up: true,
        right: true,
        bottom: true,
        left: true,
        fastOption: false,
        questionNum: false
    }
}

export default transformConfig;
