
/**
 * 图形元素处理逻辑
 */
import {
    updatePickedBlocks
} from './helper';

/**
 * 更改shape
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const changeShapeType = (courseware, action) => {
    let {data} = action;
    return updatePickedBlocks(courseware, () => data.get('shape'), ['shapeType']);
}

export {
    changeShapeType
}
