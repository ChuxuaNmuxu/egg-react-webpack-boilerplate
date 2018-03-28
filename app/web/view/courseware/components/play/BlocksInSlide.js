import React from 'react';
import PropTypes from 'prop-types';
import PlayBlock from './PlayBlock'

// 这里是所有block(元素)层的渲染
const Blocks = (props) => {
    const {slide} = props;
    const {blocks} = slide;
    return <div>
        {
            blocks.map((block, index) => {
                return <PlayBlock block={block} key={index} slide={slide} />
            })
        }
    </div>
}

Blocks.propTypes = {
    item: PropTypes.object,
    blocks: PropTypes.array,
    groupIndex: PropTypes.number,
    slide: PropTypes.object
}

export default Blocks;
