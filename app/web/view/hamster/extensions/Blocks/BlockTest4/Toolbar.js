import React from 'react'
import PropTypes from 'prop-types';

export const Component = (props) => {
    console.log(5, props.block.toJS())
    return (
        <div>
            测试4
        </div>
    )
}

Component.propTypes = {
    block: PropTypes.object
}

export default Component
