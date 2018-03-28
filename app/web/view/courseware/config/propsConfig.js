import {Map, List} from 'immutable';

const blockWrapConfig = Map({
    'position.left': Map({
        name: 'left',
        value: (value) => `${value}px`
    }),
    'position.top': Map({
        name: 'top',
        value: (value) => `${value}px`
    }),
    'size.width': Map({
        name: 'width',
        value: (value) => `${value}px`
    }),
    'size.height': Map({
        name: 'height',
        value: (value) => `${value}px`
    })
})

const blockContentConfig = Map({
    'size.width': Map({
        name: 'width',
        value: (value) => `${value}px`
    }),
    'size.height': Map({
        name: 'height',
        value: (value) => `${value}px`
    }),
    'zIndex': Map({
        name: 'zIndex',
        value: (value) => value
    }),
    'border.style': Map({
        name: 'borderStyle',
        value: (value) => value
    }),
    'border.color': Map({
        name: 'borderColor',
        value: (value) => value
    }),
    'border.width': Map({
        name: 'borderWidth',
        value: (value) => `${value}px`
    }),
    'color': Map({
        name: 'color',
        value: (value) => value
    }),
    'rotation': Map({
        name: 'transform',
        value: (value) => `rotate(${value}deg)`
    }),
    'opacity': List([Map({
        name: 'opacity',
        value: (value) => `${value / 100}`
    }), Map({
        name: 'filter',
        value: (value) => `alpha(opacity=${value})`
    })])
})

// const blockFromHTMLConfig = {
//     'zIndex': {
//         name: 'zIndex',
//         value: (value) => value
//     },
//     'border.style': {
//         name: 'borderStyle',
//         value: (value) => value
//     },
//     'border.color': {
//         name: 'borderColor',
//         value: (value) => value
//     },
//     'border.width': {
//         name: 'borderWidth',
//         value: (value) => `${value}px`
//     },
//     'color': {
//         name: 'color',
//         value: (value) => value
//     },
//     'rotation': {
//         name: 'transform',
//         value: (value) => `rotate(${value}deg)`
//     },
//     'size.width': {
//         name: 'width',
//         value: (value) => `${value}px`
//     },
//     'size.height': {
//         name: 'height',
//         value: (value) => `${value}px`
//     },
//     'opacity': [{
//         name: 'opacity',
//         value: (value) => `${value / 100}`
//     }, {
//         name: 'filter',
//         value: (value) => `alpha(opacity=${value})`
//     }]
// }

const plainBlockConfig = blockWrapConfig.takeLast(2).mergeDeep(blockContentConfig);

export {
    blockWrapConfig,
    blockContentConfig,
    plainBlockConfig
};
