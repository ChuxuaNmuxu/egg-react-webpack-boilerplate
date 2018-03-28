/**
 * 文本元素处理逻辑
 */
import {List} from 'immutable';
import {updatePickedBlocks, isGroupIndex} from './helper';
import {changeGroupStyle} from './questionBlock'
/**
 * 保存文本框的内容
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const saveTextContent = (courseware, action) => {
    let {data} = action;
    return updatePickedBlocks(courseware, () => data.get('content'), ['content'], data);
}

/**
 * 文本框自适应高度
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleTextResize = (courseware, action) => {
    let {data} = action;
    courseware = updatePickedBlocks(courseware, () => data.get('height'), ['props', 'size', 'height'], data);
    const groupIndex = data.get('groupIndex');
    if (isGroupIndex(groupIndex)) {
        return changeGroupStyle(courseware, groupIndex)
    }
    return courseware;
}

/**
 * 文本剪辑器被激活之后更新页面状态
 * @param {*Map} courseware 课件数据
 * @param {*object} action
 */
const handleEditorActive = (courseware, action) => {
    const {data} = action;
    courseware = courseware.updateIn(['current', 'blocks'], blocks => {
        const index = blocks.findIndex(block => block.get('blockId') === data.get('blockId'));
        return List().push(blocks.get(index).set('isEditor', true));
    })
    return courseware;
}

export {
    saveTextContent,
    handleTextResize,
    handleEditorActive
}
