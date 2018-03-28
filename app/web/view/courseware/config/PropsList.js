
const base = {
    'position.left': {
        type: 'number',
        unit: 'px',
        value: 0,
        maxValue: -2000,
        minValue: 2000,
        defaultValue: 0
    },
    'position.top': {
        type: 'number',
        unit: 'px',
        value: 0,
        maxValue: -2000,
        minValue: 2000,
        defaultValue: 0
    },
    'size.width': {
        type: 'number',
        unit: 'px',
        value: 0,
        maxValue: -2000,
        minValue: 2000,
        defaultValue: 0
    },
    'size.height': {
        type: 'number',
        unit: 'px',
        value: 0,
        maxValue: -2000,
        minValue: 2000,
        defaultValue: 0
    },
    'border.style': {
        defaultValue: 'none',
        options: [{
            value: 'solid',
            title: 'Solid'
        }, {
            value: 'dashed',
            title: 'Dashed'
        }, {
            value: 'dotted',
            title: 'Dotted'
        }, {
            value: 'double',
            title: 'double'
        }]
    },
    'border.color': {
        value: '#fff'
    },
    'border.width': {
        type: 'number',
        unit: 'px',
        decimals: 0,
        minValue: 0,
        maxValue: 200,
        defaultValue: 0
    },
    'opacity': {
        type: 'number',
        unit: '%',
        minValue: 0,
        maxValue: 100,
        defaultValue: 100
    },
    'rotation': {
        type: 'number',
        unit: '度',
        minValue: 0,
        maxValue: 360,
        defaultValue: 0
    },
    'animation.effect': {
        defaultValue: 'none',
        options: [{
            value: '放大进入',
            title: 'grow'
        },
        {
            value: '缩小进入',
            title: 'shrink'
        },
        {
            value: '淡入',
            title: 'fade-in'
        },
        {
            value: '淡出',
            title: 'fade-out'
        },
        {
            value: '从上滑入',
            title: 'fade-up'
        },
        {
            value: '从下滑入',
            title: 'fade-down'
        },
        {
            value: '从左滑入',
            title: 'fade-left'
        },
        {
            value: '从右滑入',
            title: 'fade-right'
        }
        ]
    },
    'animation.duration': {
        type: 'number',
        unit: 's',
        minValue: 0,
        maxValue: 50000,
        defaultValue: 0
    },
    'animation.delay': {
        type: 'number',
        unit: 's',
        minValue: 0,
        maxValue: 50000,
        defaultValue: 0
    },
    'animation.index': {
        type: 'number',
        unit: 's',
        minValue: 0,
        maxValue: 100,
        defaultValue: -1
    },
    'animation.triggle': {
        type: 'number',
        minValue: 0,
        maxValue: 1,
        defaultValue: 1
    }

}

const text = {}

const shape = {
    color: {
        type: 'string',
        defaultValue: '#fff'
    }
}

const table = {
}

const image = {}

const slide = {}

const group = {}

const question = {}

const PropsList = {
    base,
    text,
    shape,
    table,
    image,
    slide,
    group,
    question
}

export default PropsList;
