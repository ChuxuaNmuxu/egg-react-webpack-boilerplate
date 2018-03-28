import React from 'react';
import PropTypes from 'prop-types';
import blockTypes from './BlockTypes';

const Blocks = (props) => {
    // const {item: {blocks}, isMoving} = this.props;
    const {item, dispatch} = props;
    const blocks = item.get('blocks');
    const {moveCoor} = props;

    // const groupIndex = this.props.groupIndex;
    return <div>
        {
            blocks.map((block, index) => {
                let BlockWithType = blockTypes[block.get('type')].component; // 类型为type的元素block
                return <BlockWithType key={index} index={index} me={block} moveCoor={moveCoor} dispatch={dispatch} /> // index,和groupIndex都不是需要传给后端的数据，只存在props中
            })
        }
    </div>
}

Blocks.propTypes = {
    item: PropTypes.object,
    blocks: PropTypes.array,
    groupIndex: PropTypes.number,
    isMoving: PropTypes.bool,
    dispatch: PropTypes.func,
    moveCoor: PropTypes.object
}

export default Blocks;
