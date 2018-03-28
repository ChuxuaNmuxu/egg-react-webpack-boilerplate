import {mergeWith} from 'lodash';
import {fromJS} from 'immutable';

import {
    commonBlockConfig,
    commonSlideConfig,
    commonPptConfig
} from './configData.js'
import Helper from '../../../../components/RichEditor/Helper';

/**
 * 后端请求数据后的数据转化
 * @param {*object} ppt 课件数据
 * @param {*string} type 返回的数据类型
 */
const dataTransform = (ppt, type) => {
    ppt = mergeWith({}, commonPptConfig, ppt, replaceNull)
    const {slides} = ppt;

    for (let slideIndex in slides) {
        slides[slideIndex] = mergeWith({}, commonSlideConfig, slides[slideIndex], replaceNull)
        const {blocks} = slides[slideIndex];

        for (let blockIndex in blocks) {
            blocks[blockIndex] = mergeWith({}, commonBlockConfig, blocks[blockIndex], replaceNull)
        }
    }

    ppt.slides.forEach(slide => {
        slide.blocks.forEach(block => {
            // TODO: 表格的html转换
            if (block.type === 'text' && block.content) {
                block.content = Helper.convertToHtml(Helper.convertFromContent(block.content, 'html'));
            }
        })
    })

    if (type === 'immutable') {
        return fromJS(ppt)
    }
    return ppt;
}

const replaceNull = (value, src) => {
    if (src === null) {
        return value
    }
}

export default dataTransform;
