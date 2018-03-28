import React from 'react'
import PropTypes from 'prop-types';

export const Toolbar = (props) => {
    const {block, BlockUtils} = props;
    return <div
      onClick={(e) => {
          e.stopPropagation();
          console.log(80, '自定义在模板中的事件', block.toJS())
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
