import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './Block.scss';

import {blockToHTML, createStyle} from '../../../../reducers/courseware/helper'
import {plainBlockConfig} from '../../config/propsConfig'

const BlockFromHTML = (props) => {
    const {block, scale = 1} = props;
    const ContentHtml = blockToHTML(block); // 将数据转换成block结构
    const type = block.get('type');
    const style = createStyle(block, plainBlockConfig, scale);

    if (typeof ContentHtml === 'string') { // HTML
        return <div styleName='play-block-content'>
            <div dangerouslySetInnerHTML={{__html: ContentHtml}} style={style} className={`play-${type}-block block-content`} />
        </div>
    }
    // 组件形式
    return <div styleName='play-block-content'>
        <div style={style} className={`play-${type}-block block-content`} ><ContentHtml /></div>
    </div>
}

BlockFromHTML.propTypes = {
    block: PropTypes.object,
    scale: PropTypes.number
}

export default CSSModules(BlockFromHTML, styles);
