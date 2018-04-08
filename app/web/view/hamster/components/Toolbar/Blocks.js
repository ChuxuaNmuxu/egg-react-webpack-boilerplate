import React from 'react';
import PropTypes from 'prop-types';

import configHelper from '../../config/configHelper';
import BlockUtils from '../../Utils/BlockUtils'

const handleClick = (block) => {
    const onClick = block.get('onClick')
    onClick && onClick(block, BlockUtils);
};

const Block = (props) => {
    const {block} = props;
    const Toolbar = block.get('toolbar');
    return (
        <div
          className='block-item'
          title={block.get('description')}
          onClick={() => handleClick(block)}>
            {
                Toolbar ? <Toolbar {...{block, BlockUtils}} /> : <div>
                    <i className={block.get('icon')} /><br />
                    {block.get('title')}&nbsp;
                </div>
            }
        </div>
    );
}

Block.propTypes = {
    block: PropTypes.object
}

export const Component = (props) => {
    return (
        <div className='blocks'>
            {
                configHelper.blocks.map(block => <Block block={block} />)
            }
        </div>
    )
}

Component.propTypes = {
    onAdd: PropTypes.func.isRequired
}

export default Component;
