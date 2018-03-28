import React from 'react';

const shapeHoc = config => WrapperComponent => {
    // const {shape='', stroke={stroke}, strokeDasharray} = config
    let {borderStyle = '', borderWidth = 0, borderColor = ''} = config;
    let strokeDasharray = 0;
    switch (borderStyle) {
    case 'dotted':
        strokeDasharray = 4 / 16;
        break;
    case 'dashed':
        strokeDasharray = 8 / 16;
        break;
    default:
        break;
    }

    borderWidth = borderStyle ? borderWidth / 16 : 0;

    // TODO: 线条需要的位置属性，后面在修改

    return class shapeComponent extends React.Component {
        render () {
            return <WrapperComponent strokeDasharray={strokeDasharray} stroke={borderColor} strokeWidth={borderWidth} />
        }
    }
}

export default shapeHoc;
