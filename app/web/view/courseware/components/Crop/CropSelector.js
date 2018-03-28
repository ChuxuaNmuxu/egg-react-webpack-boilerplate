import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Icon} from 'antd';

class CropSelector extends Component {
    render () {
        let style = {};
        const styleData = this.props.selectorProps;
        for (let key of Object.keys(styleData)) {
            style[key] = styleData[key] + 'px';
        }
        return <div className='cropSelector' data-select style={style} onMouseDown={(e) => this.props.handleMove(this.props.index, e)}>
            <div className='eb-resizable-n eb-resizable' data-direction='n' />
            <div className='eb-resizable-e eb-resizable' data-direction='e' />
            <div className='eb-resizable-s eb-resizable' data-direction='s' />
            <div className='eb-resizable-w eb-resizable' data-direction='w' />
            <div className='delete' onMouseDown={(e) => { e.stopPropagation(); this.props.handleDelete(this.props.index) }}>
                <Icon type='close' />
            </div>
        </div>
    }
}

CropSelector.propTypes = {
    selectorProps: PropTypes.object,
    index: PropTypes.number,
    handleDelete: PropTypes.func,
    handleMove: PropTypes.func
}

export default CropSelector;
