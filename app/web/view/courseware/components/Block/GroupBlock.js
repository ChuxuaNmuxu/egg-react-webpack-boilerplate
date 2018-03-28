import React from 'react';
import PropTypes from 'prop-types';

import Block from './Block';
import blockTypes from './BlockTypes';

/**
 * 组合习题元素
 */
// class GroupBlock extends React.Component {
//     render () {
//         const {members} = this.props.me;
//         console.log(33, this.props);
//         return (
//             <Block {...this.props}>
//                 {
//                     <Blocks item={{blocks: members}} groupIndex={this.props.index} />
//                 }
//             </Block>
//         )
//     }
// }

const GroupBlock = (props) => {
    const { me, moveCoor, dispatch } = props;
    const members = me.get('members');
    const {index: groupIndex} = props; // member元素所在的习题组的index
    return (
        <Block {...props}>
            {
                members.map((block, index) => { // blocks调用了本组件，这里有需要调用Blocks组件,为了防止混乱，重写了一边
                    const BlockWithType = blockTypes[block.get('type')].component; // 类型为type的元素block
                    return <BlockWithType key={index} index={index} me={block} moveCoor={moveCoor} groupIndex={groupIndex} dispatch={dispatch} />
                })
            }
        </Block>
    )
}

GroupBlock.propTypes = {
    me: PropTypes.object,
    groupIndex: PropTypes.number,
    index: PropTypes.number,
    isMoving: PropTypes.bool,
    moveCoor: PropTypes.object,
    dispatch: PropTypes.func
}

export default GroupBlock;
