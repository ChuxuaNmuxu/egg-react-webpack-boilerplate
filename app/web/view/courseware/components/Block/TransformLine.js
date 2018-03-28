import React from 'react'
import PropTypes from 'prop-types';

/**
 * 线条元素块变形移动行为辅助框
 */
class TransformLine extends React.Component {
    render () {
        return (
            <div>
                transform line
            </div>
        )
    }
}

TransformLine.propTypes = {
    blockProps: PropTypes.any
}

export default TransformLine;
