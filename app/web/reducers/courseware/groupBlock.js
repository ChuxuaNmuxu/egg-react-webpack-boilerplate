/**
 * 组合元素处理逻辑
 */
import {
    updateBlocks,
    getCurrentBlocks,
    getTheBlock,
    updatePickedBlocks
} from './helper';
import {calcGroupStyle} from './exercise'
import {List, Map} from 'immutable'
import {ALIGN_LIMIT} from '../../view/courseware/config/constant';

/**
 * 组合对齐
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const groupAlign = (courseware, action) => {
    let {data} = action;
    const position = data.get('position');
    /**
     * 得到选中的block
     */
    const currentBlocks = getCurrentBlocks(courseware); // current中的标记被选中的blocks
    const groupBlocks = updateBlocks(courseware).map((gBlock, gIndex) => { // 被选中的blocks的list
        if (currentBlocks.some(block => block.get('index') === gIndex)) {
            return gBlock;
        }
    }).filter(block => block);

    /**
     * 计算被选中的block的边界与中心线
     */
    const groupStyle = calcGroupStyle(groupBlocks);

    /**
     * 计算所需的参数
     * 计算公式： block.props.position[pos] = groupStyle[data.position] - radio * block.props.size[self]
     */
    let radio = 0; // width, height前的系数
    let self = 'width';
    let pos = 'left';
    switch (position) {
    case 'center':
        radio = 0.5;
        break;
    case 'right':
        radio = 1;
        break;
    case 'top':
        self = 'height';
        pos = 'top';
        break;
    case 'middle':
        radio = 0.5;
        self = 'height';
        pos = 'top';
        break;
    case 'bottom':
        radio = 1;
        self = 'height';
        pos = 'top';
        break;
    default:
        break;
    }

    /**
     * 改变blocks的位置
     */
    courseware = updateBlocks(courseware, blocks => {
        return blocks.map((block, index) => { // 被选中的blocks的list
            if (currentBlocks.some(curBlock => curBlock.get('index') === index)) {
                return block.setIn(['props', 'position', pos], groupStyle.get(position) - radio * block.getIn(['props', 'size', self]))
            }
            return block
        })
    })

    return courseware;
}

/**
 * 对齐导航线及自动对齐
 * @param {*object} courseware
 * @param {*object} data
 */
const blockSnap = (courseware, data) => {
    let guides = List().setSize(6);
    let block = Map();
    let theBlock = Map();
    let height = 0;
    let width = 0;
    let left = 0;
    let top = 0;

    const blocksPicked = courseware.getIn(['current', 'blocks']);
    if (blocksPicked.size === 1) { // 只有一个元素被选中
        theBlock = getTheBlock(courseware); // 被拖拽的元素
        height = theBlock.getIn(['props', 'size', 'height']);
        width = theBlock.getIn(['props', 'size', 'width']);
        left = theBlock.getIn(['props', 'position', 'left']);
        top = theBlock.getIn(['props', 'position', 'top']);
    } else { // 多个元素被选中
        const blocks = updateBlocks(courseware).filter(block => blocksPicked.some(item => item.get('blockId') === block.get('id')));
        const block = calcGroupStyle(blocks);
        height = block.get('height');
        width = block.get('width');
        left = block.get('left');
        top = block.get('top');
    }

    // 当前拖拽元素的方位信息
    const center = left + width / 2;
    const right = left + width;
    const middle = top + height / 2;
    const bottom = top + height;
    block = Map({
        left: left,
        center: center,
        right: right,
        top: top,
        middle: middle,
        bottom: bottom
    })

    // 吸附导航线时当前拖拽block需要移动的距离
    let leftDiff = 0;
    let topDiff = 0;

    let horizon = List(['left', 'center', 'right']);
    let vertial = List(['top', 'middle', 'bottom']);

    // 用拖拽元素的6个位置依次与页面元素的6个位置对比
    courseware.getIn(['current', 'snapBounds']).forEach(bound => {
        let alignTo = ''; // 已经和某一位置对齐了

        // 其他某一元素的方位信息
        const boundLeft = bound.get('left');
        const boundTop = bound.get('top');
        const boundCenter = bound.get('center');
        const boundBottom = bound.get('bottom');
        const boundMiddle = bound.get('middle');
        const boundRight = bound.get('right');

        if (boundLeft < block.get('right') && block.get('left') < boundRight) { // 可能有对齐情况的判断，减少遍历次数
            horizon.forEach((pos, index) => { // 垂直对齐
                if (Math.abs(block.get(pos) - boundLeft) < ALIGN_LIMIT || Math.abs(block.get(pos) - boundCenter) < ALIGN_LIMIT || Math.abs(block.get(pos) - boundRight) < ALIGN_LIMIT) {
                    horizon.forEach(value => {
                        if (alignTo !== value && Math.abs(block.get(pos) - bound.get(value)) < ALIGN_LIMIT) {
                            leftDiff = bound.get(value) - block.get(pos); // (ALIGN_LIMIT = 5) 内被拖动元素与对齐元素的差距
                            alignTo = value; // 和某一位置对齐的标志
                            return false;
                        }
                    })
                    if (guides.get(index)) { // 多个对齐，对齐最远的block
                        const topCurrent = Math.min(block.get('top'), boundTop);
                        const heightCurrent = Math.max(block.get('bottom'), boundBottom) - Math.min(block.get('top'), boundTop);
                        const topPicked = Math.min(topCurrent, guides.getIn([index, 'top']));
                        guides = guides.update(index, guide => {
                            return guide.merge(Map({
                                top: topPicked,
                                height: topPicked === topCurrent ? heightCurrent : guides.getIn([index, 'height'])
                            }))
                        })
                    } else { // 第一次对齐
                        guides = guides.splice(index, 1, Map({
                            left: block.get(pos) + leftDiff,
                            top: Math.min(block.get('top'), boundTop),
                            height: Math.max(block.get('bottom'), boundBottom) - Math.min(block.get('top'), boundTop)
                        }))
                    }
                }
            })
        }
        if (boundTop < bottom && top < boundBottom) {
            vertial.forEach((pos, index) => { // 水平对齐
                index += 3;
                if (Math.abs(block.get(pos) - boundTop) < ALIGN_LIMIT || Math.abs(block.get(pos) - boundMiddle) < ALIGN_LIMIT || Math.abs(block.get(pos) - boundBottom) < ALIGN_LIMIT) {
                    vertial.forEach(value => {
                        if (alignTo !== value && Math.abs(block.get(pos) - bound.get(value)) < ALIGN_LIMIT) {
                            topDiff = bound.get(value) - block.get(pos);
                            alignTo = value;
                            return false;
                        }
                    })
                    if (guides.get(index)) { // 多个对齐，对齐最远的block
                        const leftCurrent = Math.min(block.get('left'), boundLeft);
                        const widthCurrent = Math.max(block.get('right'), boundRight) - Math.min(block.get('left'), boundLeft);
                        const leftPicked = Math.min(leftCurrent, guides.getIn([index, 'left']));
                        guides = guides.splice(index, 1, Map({
                            top: block.get(pos) + topDiff,
                            left: Math.min(leftCurrent, guides.getIn([index, 'left'])),
                            width: leftPicked === leftCurrent ? widthCurrent : guides.getIn([index, 'width'])
                        }))
                    } else { // 第一次对齐
                        guides = guides.splice(index, 1, Map({
                            top: block.get(pos) + topDiff,
                            left: Math.min(block.get('left'), boundLeft),
                            width: Math.max(block.get('right'), boundRight) - Math.min(block.get('left'), boundLeft)
                        }))
                    }
                }
            })
        }
    })

    // 小于（ALIGN_LIMIT = 5px）时，元素自动对齐
    courseware = updatePickedBlocks(courseware, left => left + leftDiff, ['props', 'position', 'left']);
    courseware = updatePickedBlocks(courseware, top => top + topDiff, ['props', 'position', 'top']);

    return Map({
        guides: guides,
        courseware: courseware
    })
}

/**
 * 框选元素
 * @param {*object} courseware
 * @param {*object} data
 */
const selectBlocks = (courseware, action) => {
    let {data} = action;

    const pageX = data.get('pageX');
    const pageY = data.get('pageY');
    const current = courseware.get('current');
    const slideOffsetLeft = current.get('slideOffsetLeft');
    const slideOffsetTop = current.get('slideOffsetTop');
    const initPageX = current.get('initPageX');
    const initPageY = current.get('initPageY');

    /**
     * 选择框的边界
     */
    const selectorLeft = Math.min(pageX, initPageX) - slideOffsetLeft;
    const selectorTop = Math.min(pageY, initPageY) - slideOffsetTop;
    const selectorRight = selectorLeft + Math.abs(pageX - initPageX);
    const selectorBottom = selectorTop + Math.abs(pageY - initPageY);

    let blockSelected = List(); // 被选中的block

    /**
     * 遍历block，将选中的block选出来
     */
    updateBlocks(courseware).forEach((block, index) => {
        // const rotation = block.getIn(['props', 'rotation'])
        const width = block.getIn(['props', 'size', 'width']);
        const height = block.getIn(['props', 'size', 'height']);

        const top = block.getIn(['props', 'position', 'top']);
        const left = block.getIn(['props', 'position', 'left']);
        const right = left + width;
        const bottom = top + height;

        if (top < selectorBottom && selectorTop < bottom && right > selectorLeft && selectorRight > left) { // 判断被选中
            blockSelected = blockSelected.push(Map({
                index: index,
                blockId: block.get('id')
                // initStyle: Map({
                //     left: left,
                //     top: top,
                //     height: height,
                //     width: width,
                //     rotation: rotation
                // })
            }))
        }
    })

    /**
     * 更新current状态,将blocks加进去
     */
    return courseware.withMutations(courseware => {
        courseware
        .setIn(['current', 'blocks'], blockSelected)
        .setIn(['current', 'isGroupSelect'], false)
    })
}

export {
    groupAlign,
    blockSnap,
    selectBlocks
}
