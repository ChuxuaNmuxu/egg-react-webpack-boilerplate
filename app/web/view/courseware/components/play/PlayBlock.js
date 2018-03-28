import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './play.scss'
import {merge, get} from 'lodash';
import {fromJS} from 'immutable';

import {initStyle} from '../DataTransfrom/configData';
import {blockWrapConfig} from '../../config/propsConfig';
import {createStyle} from '../../../../reducers/courseware/helper';
import Block from '../PlainBlock/Block'

class PlayBlock extends React.Component {
    render () {
        let {block, slide} = this.props;
        console.log('playBlock component:', block);
        // const {props} = block;
        const {animation: {effect, index, duration, delay, triggle}} = block.props;
        const blockDataSet = {
            'data-block-id': block.id,
            'data-block-type': block.type,
            'data-block-is-question': block.isQuestion,
            'data-slide-id': slide.id
        }

        block = fromJS(block); // block从后端请求得到，转换成immutable
        let blockStyle = createStyle(block, blockWrapConfig);

        let aniClassName = 'play-block';
        let aniProps = {};
        if (triggle === 'comeIn') { // 入场时触发动画
            if (effect !== '') {
                blockStyle['animation'] = `${effect} ${duration * 1000}ms ${delay * 1000}ms forwards`;

                merge(blockStyle, get(initStyle, effect), {
                    opacity: 0
                })
            }
        } else if (triggle === 'click') { // 单击时触发动画
            effect === '' || (aniClassName += ` fragment ${effect}`);
            aniProps['data-fragment-index'] = index;
        }
        return (
            <div style={blockStyle} styleName='play-block' className={aniClassName} {...aniProps} {...blockDataSet}>
                <Block block={block} />
            </div>
        )
    }
}

PlayBlock.propTypes = {
    block: PropTypes.object,
    slide: PropTypes.object
}

export default CSSModules(PlayBlock, styles);