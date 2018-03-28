/**
 * 键盘快捷键的处理
 */
import {
    updatePickedBlocks
} from './helper';

/**
 * 键盘按上下左右箭头的处理
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleArrowEvent = (courseware, action) => {
    // const {data} = action;
    // let { blocks } = courseware.current;
    // let positive = 1;
    // let arrDir = 'top';
    // switch (data.arrawDirection) {
    // case 'arrowup':
    //     positive = -1;
    //     break;
    // case 'arrowleft':
    //     positive = -1;
    //     arrDir = 'left';
    //     break;
    // case 'arrowright':
    //     arrDir = 'left';
    //     break;
    // }
    // blocks.map((block) => {
    //     getBlocks(courseware)[block.index].props.position[arrDir] += positive;
    // })
    // return courseware;

    let {data} = action;

    let positive = 1;
    let arrDir = 'top';
    switch (data.get('arrawDirection')) { // 计算位置的参数
    case 'arrowup':
        positive = -1;
        break;
    case 'arrowleft':
        positive = -1;
        arrDir = 'left';
        break;
    case 'arrowright':
        arrDir = 'left';
        break;
    }

    return updatePickedBlocks(courseware, position => position + positive, ['props', 'position', arrDir])
}

export {
    handleArrowEvent
}
