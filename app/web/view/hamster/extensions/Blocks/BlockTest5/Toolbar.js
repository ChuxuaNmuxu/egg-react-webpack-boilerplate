import React from 'react'
import PropTypes from 'prop-types';

export const Toolbar = (props) => {
    const {block, BlockUtils} = props;
    return <div
      onClick={(e) => {
          e.stopPropagation();
          BlockUtils.addBlock(block)
      }}>
        {block.get('title')}
    </div>
}

Toolbar.propTypes = {
    block: PropTypes.object,
    BlockUtils: PropTypes.object
}

export default Toolbar
