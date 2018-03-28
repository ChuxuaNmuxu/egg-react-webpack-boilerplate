import React from 'react';
import PropTypes from 'prop-types';

import BlockContent from './BlockContent';
import {createStyle} from '../../../../reducers/courseware/helper';
import {plainBlockConfig} from '../../config/propsConfig';

const GroupBlock = (props) => {
    const {block, scale = 1} = props;
    const members = block.get('members');

    // const blockStyle = {
    //     width: block.getIn(['props', 'size', 'width']) * scale,
    //     height: block.getIn(['props', 'size', 'height']) * scale,
    //     position: 'relative',
    //     border: `1px solid rgba(27, 174, 225, 0.4)`
    // }
    const blockStyle = createStyle(block, plainBlockConfig, scale);
    return <div style={blockStyle} className='play-group-block' >
        {
            members.map((block, index) => {
                const style = {
                    left: block.getIn(['props', 'position', 'left']) * scale,
                    top: block.getIn(['props', 'position', 'top']) * scale,
                    position: 'absolute'
                }
                return <div style={style} className='play-member-block' key={index}>
                    <BlockContent block={block} scale={scale} />
                </div>
            })
        }
    </div>
}

GroupBlock.propTypes = {
    block: PropTypes.object,
    scale: PropTypes.number
}

export default GroupBlock;
