import React from 'react';
import PropTypes from 'prop-types';

import BlockContent from './BlockContent';
import GroupBlock from './GroupBlock';

const Block = (props) => { // 参数：元素的数据
    const {block, scale = 1} = props;
    const type = block.get('type');
    if (type === 'group') {
        return <GroupBlock block={block} scale={scale} />
    }
    return <BlockContent block={block} scale={scale} />;
}

Block.propTypes = {
    block: PropTypes.object,
    scale: PropTypes.number
}

export default Block;
