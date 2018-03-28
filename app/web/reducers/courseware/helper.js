import {
    set,
    isString,
    isArray,
    uniq,
    merge,
    unset
} from 'lodash';
import Immutable, {List, fromJS, Map} from 'immutable'
import uuid from 'uuid';

import {
    emptyExercise,
    emptyLink,
    emptySlide
} from './config';
import {
    blockSnap
} from './groupBlock';
import {getExerciseByBlockId} from './exercise'
import {changeGroupStyle} from './questionBlock'
import blockHtml from '../../view/courseware/config/BlockHtml';
import {INITIAL_ZINDEX, MIN_BLOCK_HEIGHT, MIN_BLOCK_WIDTH, MAXQUESTIONAMOUNT} from '../../view/courseware/config/constant';
/**
 * 更新卡片索引
 * @param {object} courseware 课件数据
 */
const refreshSlideIndex = courseware => {
    return courseware.updateIn(['index', 'slides'], slides => {
        return courseware.getIn(['ppt', 'slides']).toKeyedSeq().mapEntries(([k, v]) => [v.get('id'), k]);
    });
}

/**
 * 更新块索引
 * @param {object} courseware 课件数据
 */
const refreshBlockIndex = courseware => {
    let blocks = Immutable.Map();
    blocks = blocks.withMutations(blocks => {
        courseware.getIn(['ppt', 'slides']).forEach((slide, slideIndex) => {
            slide.get('blocks').forEach(block => {
                blocks.set(block.get('id'), slideIndex)
            });
        });
    });
    return courseware.setIn(['index', 'blocks'], blocks);
}

/**
 * 更新索引
 * @param {object} courseware 课件数据
 * @param {string|array} type 类型，可传空、字符串、数组
 */
const refreshIndex = (courseware, type) => {
    let types = type;
    if (!types) {
        types = courseware.get('index').keySeq().toArray();
    } else if (isString(types)) {
        types = [types];
    } else if (!isArray(types)) {
        return courseware;
    }
    types.forEach(type => {
        switch (type) {
        case 'slides':
            courseware = refreshSlideIndex(courseware);
            break;
        case 'blocks':
            courseware = refreshBlockIndex(courseware);
        }
    });
    return courseware;
}

/**
 * 获取一组slide对应的slideIndex
 * @param {object} courseware 课件数据
 * @param {array} slideIds slideId数组
 */
const getSlideIdxes = (courseware, slideIds) => {
    courseware = refreshIndex(courseware, 'slides');
    return courseware.getIn(['index', 'slides']).filter((value, key) => slideIds.indexOf(key) > -1).valueSeq().toArray();
}

/**
 * 获取一组block对应的slideIndex
 * @param {object} courseware 课件数据
 * @param {array} blockIds blockId数组
 */
const getBlockIdxes = (courseware, blockIds) => {
    courseware = refreshIndex(courseware, 'blocks');
    return uniq(
        courseware
        .getIn(['index', 'blocks'])
        .filter((value, key) => blockIds.indexOf(key) > -1)
        .valueSeq()
        .toArray()
    );
}

/**
 * 获取某个环节中slide对应的index
 * @param {object} courseware 课件数据
 * @param {number} linkIndex 环节索引
 */
const getLinkSlideIdxes = (courseware, linkIndex) => {
    return getSlideIdxes(courseware, courseware.getIn(['ppt', 'teachingLinks', linkIndex, 'slides']));
}

/**
 * 根据slideId获取环节索引
 * @param {object} courseware 课件数据
 * @param {number} linkIndex 环节索引
 */
const getLinkIndexBySlideId = (courseware, slideId) => {
    return courseware.getIn(['ppt', 'teachingLinks']).findIndex(item => item.get('slides').indexOf(slideId) > -1)
}

/**
 * 根据slideIndex获取环节索引
 * @param {object} courseware 课件数据
 * @param {number} linkIndex 环节索引
 */
const getLinkIndexBySlideIndex = (courseware, slideIndex) => {
    return getLinkIndexBySlideId(courseware, courseware.getIn(['ppt', 'slides', slideIndex, 'id']));
}

/**
 * 创建新卡片
 */
const createNewSlide = (id = '') => {
    return fromJS(emptySlide).set('id', 'slide-' + (id || uuid.v4()));
}

/**
 * 创建新环节
 */
const createNewLink = (id = '') => {
    return fromJS(emptyLink).set('id', 'teachingLink-' + (id || uuid.v4()));
}

/**
 * 创建新练习
 */
const createNewExercise = (id = '') => {
    return fromJS(emptyExercise).set('id', 'exercise-' + (id || uuid.v4()));
}

/**
 * 获取当前slide的block数组
 * ignoreGroup 不在习题中查找block
 */
const getBlocks = (courseware, ignoreGroup) => {
    const {slideIndex, blocks} = courseware.get('current');
    // 判断是否要取的是习题中的block
    const isGetBlockInGroup = blocks.length > 0 && typeof blocks[0].groupIndex === 'number';
    if (isGetBlockInGroup && !ignoreGroup) {
        return courseware.ppt.slides[slideIndex].blocks[blocks[0].groupIndex].members;
    } else {
        return courseware.ppt.slides[slideIndex].blocks;
    }
}

/**
 * 更新页面被选中元素的的属性，可能是一个或者多个元素
 * @param {*Map} courseware 课件数据
 * @param {*function} fn 回调函数
 * @param {*array} path block要更改属性的路径
 * @param {*Map} data 可选参数，给定block的index和groupIndex
 */
const updatePickedBlocks = (courseware, fn, path, data) => {
    const blocksPicked = data ? List().push(data) : getCurrentBlocks(courseware); // 已经被选中的blocks
    const slideIndex = courseware.getIn(['current', 'slideIndex']); // 当前slide的索引
    blocksPicked.forEach((value, key) => {
        let blockPath = []; // block的路径
        const groupIndex = value.get('groupIndex'); // 组合习题的索引; undefined: 不是组合习题
        const index = value.get('index'); // block的索引或者组合习题中的member的索引
        const isMember = typeof groupIndex === 'number'; // true: 当前操作的是组合习题中的member
        if (isMember) {
            blockPath = ['ppt', 'slides', slideIndex, 'blocks', groupIndex, 'members', index];
        } else {
            blockPath = ['ppt', 'slides', slideIndex, 'blocks', index];
        }
        blockPath = path ? blockPath.concat(path) : blockPath;
        courseware = courseware.updateIn(blockPath, fn);
    })
    return courseware;
}

/**
 * 对整个blocks数组进行操作,没有操作函数则直接返回blocks
 * @param {*object} courseware 课件数据
 * @param {*function} fn 回调函数
 */
const updateBlocks = (courseware, fn) => {
    const slideIndex = courseware.getIn(['current', 'slideIndex']); // 当前slide的索引
    if (fn) {
        return courseware.updateIn(['ppt', 'slides', slideIndex, 'blocks'], fn);
    }
    return courseware.getIn(['ppt', 'slides', slideIndex, 'blocks'])
}

/**
 * 返回被操作的唯一数组
 * @param {*object} courseware 课件数据
 * @param {*Map} data 选中元素的数据
 */
const getTheBlock = (courseware, data) => {
    const blockPicked = data || getCurrentBlocks(courseware).get(0); // 已经被选中的blocks
    const slideIndex = courseware.getIn(['current', 'slideIndex']); // 当前slide的索引
    const groupIndex = blockPicked.get('groupIndex'); // 组合习题的索引; undefined: 不是组合习题
    const index = blockPicked.get('index'); // block的索引或者组合习题中的member的索引
    const isMember = typeof groupIndex === 'number'; // true: 当前操作的是组合习题中的member
    if (isMember) {
        return courseware.getIn(['ppt', 'slides', slideIndex, 'blocks', groupIndex, 'members', index])
    } else {
        return courseware.getIn(['ppt', 'slides', slideIndex, 'blocks', index])
    }
}

/**
 * 获取current中的元素数据
 * @param {*object} courseware 课件数据
 */
const getCurrentBlocks = (courseware) => {
    return courseware.getIn(['current', 'blocks']);
}

/**
 * blockId更新question, 没有blockId则取current中的blockId, 没有回调函数则返回question
 * @param {*Map} courseware 课件数据
 * @param {*function} fn 回调函数
 */
const updateQuestion = (courseware, fn, blockId) => {
    blockId = blockId || courseware.getIn(['current', 'blocks', 0, 'blockId']);
    let exerciseIndex = null;
    let questionsIndex = null;

    courseware.getIn(['ppt', 'exercises']).forEach((exercise, exIndex) => {
        exercise.get('questions').forEach((question, qIndex) => {
            if (question.get('blockId') === blockId) {
                questionsIndex = qIndex;
                exerciseIndex = exIndex;
                return false
            }
        })
        if (typeof exerciseIndex === 'number') return false;
    })

    if (fn) {
        return courseware.updateIn(['ppt', 'exercises', exerciseIndex, 'questions', questionsIndex], fn)
    }
    return courseware.getIn(['ppt', 'exercises', exerciseIndex, 'questions', questionsIndex])
}

/**
 * 获取最大的zIndex
 * @param {*Map} courseware 课件数据
 * @param {*} isMember 取组合习题内members的最大层级
 */
const getMaxZindex = (courseware, isMember) => {
    // const {zIndexs} = courseware.current;
    // const zIndexMax = zIndexs.length === 0 ? 9 : Math.max.apply(null, zIndexs);
    // return zIndexMax;
    let zIndexs = courseware.getIn(['current', 'zIndexs']);
    if (isMember) {
        zIndexs = courseware.getIn(['current', 'memberZIndexs']);
    }
    const zIndexMax = zIndexs.size === 0 ? INITIAL_ZINDEX - 1 : zIndexs.max();
    return zIndexMax;
}

/**
 * 删除block,返回一个对象： courseware, 删除的block
 * @param {object} blocks4Del 待删除的对象数组
 * @param {object} courseware 课件数据
 */

const deleteBlock = (courseware, blocks4Del) => {
    blocks4Del = blocks4Del || courseware.getIn(['current', 'blocks']); // 要删除的block数组信息

    const groupIndex = blocks4Del.getIn([0, 'groupIndex']);
    if (blocks4Del.size === 1 && isGroupIndex(groupIndex)) { // 删除的是组合习题中的元素
        const index = blocks4Del.getIn([0, 'index']);
        const slideIndex = courseware.getIn(['current', 'slideIndex']);
        const members = courseware.getIn(['ppt', 'slides', slideIndex, 'blocks', groupIndex, 'members']);
        if (members.size > 1) { // 组合习题中有多个元素，删除该元素
            courseware = courseware.withMutations(courseware => {
                courseware
                .deleteIn(['ppt', 'slides', slideIndex, 'blocks', groupIndex, 'members', index])
                .update(courseware => changeGroupStyle(courseware)) // 重新计算外边框的大小
            })
            return Map({
                courseware: courseware
            })
        } else if (members.size === 1) { // 如果组合习题中只有一个元素了，删除该元素则删除组合习题
            blocks4Del = blocks4Del.update(0, block => block.merge(Map({
                index: groupIndex,
                groupIndex: undefined
            })))
        }
    }

    // 被删除的元素
    const isDelete = (block, index) => !!blocks4Del.find(value => value.get('index') === index);
    const blocksDel = updateBlocks(courseware).filter(isDelete);

    courseware = updateBlocks(courseware, blocks => blocks.filterNot(isDelete)) // 删除元素
                .withMutations(courseware => {
                    courseware
                    .updateIn(['current', 'zIndexs'], zIndexs => {
                        let del = List();
                        zIndexs = zIndexs.filter((zIndex, index) => { // 删除的zIndex中的对应项
                            if (isDelete(null, index)) {
                                del = del.push(zIndex);
                                return false;
                            }
                            return true;
                        }).map((zIndex, index) => {
                            del.forEach(z => { // 遍历zIndexs，将被删除后的zIndex减一，保证zIndex的连续性
                                if (z < zIndex) {
                                    zIndex--
                                }
                            })
                            return zIndex
                        })
                        return zIndexs;
                    })
                    .updateIn(['current', 'blocks'], blocks => blocks.clear())
                })

    courseware = applyIndex(courseware); // 更新zIndexs
    courseware = refreshIndex(courseware, 'blocks');

    // 删除习题截图
    blocksDel.forEach(block => {
        if (block.get('isQuestion')) {
            courseware = deleteQuestion(courseware, block.get('id'));
        }
    })

    return Map({
        courseware: courseware,
        blocksDel: blocksDel
    })
}

/**
 * 删除习题
 * @param {object} courseware 课件数据
 * @param {object} blockId 元素Id
 */
const deleteQuestion = (courseware, blockId) => {
    const exerciseIndex = courseware.getIn(['ppt', 'exercises']).findIndex(value => value.get('questions').some(question => question.get('blockId') === blockId));
    if (exerciseIndex > -1) {
        // 过滤对应的习题
        courseware = courseware.updateIn(['ppt', 'exercises', exerciseIndex, 'questions'], questions => questions.filterNot(question => question.get('blockId') === blockId));
        // 练习中没有习题，删除练习
        if (courseware.getIn(['ppt', 'exercises', exerciseIndex, 'questions']).size === 0) {
            // courseware = courseware.updateIn(['ppt', 'exercises'], exercises => exercises.splice(exerciseIndex, 1))
            courseware = courseware.deleteIn(['ppt', 'exercises', exerciseIndex])
        }
    }

    return courseware
}

/**
 * 使blocks数组的中zIndex和zIndexs数组保持一致
 * @param {map} courseware 课件数据
 * @param {bool} groupIndex 组合习题的member元素
 */
const applyIndex = (courseware, groupIndex) => {
    const isMember = isGroupIndex(groupIndex);
    let zIndexs = courseware.getIn(['current', 'zIndexs']);
    if (isMember) {
        zIndexs = courseware.getIn(['current', 'memberZIndexs']);
    }

    zIndexs.forEach((zindex, index) => {
        courseware = updatePickedBlocks(courseware, () => zindex, ['props', 'zIndex'], Map({index: index, groupIndex: groupIndex}));
    })
    return courseware
}

/**
 * 判断groupIndex是否存在
 * @param {object} groupIndex 块状元素的group索引
 */
const isGroupIndex = (groupIndex) => {
    return typeof groupIndex === 'number';
}

/**
 * 获取当前被操作的唯一block
 * @param {object} courseware 课件数据
 */
const getFocusedBlock = (courseware) => {
    const {blocks} = courseware.current;
    if (blocks.length > 0) {
        const {index} = blocks[0];
        return getBlocks(courseware)[index];
    } else {
        return {}
    }
}

/**
 * slide的鼠标移动处理
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleSlideMouseMove = (courseware, data) => {
    let moveX = data.get('moveX');
    let moveY = data.get('moveY');
    const pageX = data.get('pageX');
    const pageY = data.get('pageY');
    const shiftKey = data.get('shiftKey');

    const current = courseware.get('current');
    const isDraging = current.get('isDraging')

    let guides = List();

    const blocks = current.get('blocks');

    blocks.forEach(block => {
        /**
         * 每次遍历必须用到的变量
         */
        const index = block.get('index');
        const groupIndex = block.get('groupIndex');
        const blockIndexed = Map({index: index, groupIndex: groupIndex}) // 通过current的索引匹配实际的block数据，plus：怎么想这里用面向对象都更方面点

        if (isDraging) { // 拖拽
            if (shiftKey) {
                const dragDir = data.get('dragDir');
                dragDir === 'h' ? moveY = 0 : moveX = 0;
            }

            let rotation = 0;
            if (isGroupIndex(groupIndex)) {
                rotation = getTheBlock(courseware, Map({
                    index: groupIndex
                })).getIn(['props', 'rotation']);
            }
            const isUpdown = rotation > 90 && rotation < 270 ? -1 : 1;  // 旋转颠倒后
            moveX = isUpdown * moveX;
            moveY = isUpdown * moveY;
            courseware = updatePickedBlocks(courseware, value => value + moveX, ['props', 'position', 'left'], blockIndexed);
            courseware = updatePickedBlocks(courseware, value => value + moveY, ['props', 'position', 'top'], blockIndexed);
        } else if (current.get('isResizing')) { // 拉伸
            let resizeDirection = current.get('resizeDirection');

            const theBlock = getTheBlock(courseware, blockIndexed); // 当前操作的数组
            const width = theBlock.getIn(['props', 'size', 'width']);
            const height = theBlock.getIn(['props', 'size', 'height']);
            let rotation = theBlock.getIn(['props', 'rotation']);
            const type = theBlock.get('type');

            let isCorner = false; // 是否拉动的是四个角
            let isUpdown = rotation > 90 && rotation < 270 ? -1 : 1;  // 旋转颠倒后

            if (isGroupIndex(groupIndex)) {
                const parentRotation = getTheBlock(courseware, Map({
                    index: groupIndex
                })).getIn(['props', 'rotation']);

                // const dirReverse = {
                //     'n': 's',
                //     'e': 'w',
                //     's': 'n',
                //     'w': 'e'
                // }
                // if (parentRotation > 90 && parentRotation < 270) {
                //     resizeDirection = resizeDirection.split('').map(value => dirReverse[value]).join('');
                //     console.log(80, resizeDirection)
                // }

                const memberRotation = (parentRotation + rotation) % 360;
                isUpdown = memberRotation > 90 && memberRotation < 270 ? -1 : 1;  // 旋转颠倒后
            }

            moveX = isUpdown * moveX;
            moveY = isUpdown * moveY;

            const horitonalMove = (courseware, nextWidth) => { // 水平拉伸
                // 方向差异修正系数
                const pole = /e/.test(resizeDirection) ? 1 : -1; // 拉伸方向不同时方位正增长还是负增长
                const needMoveX = /e/.test(resizeDirection) ? 0 : 1;

                const moveX = nextWidth - width;
                courseware = updatePickedBlocks(courseware, () => nextWidth, ['props', 'size', 'width'], blockIndexed);
                // const l = (widthNew - width) / 2;

                // 有旋转时拉伸修正top,left
                const l = moveX / 2;
                const radian = rotation * Math.PI / 180;
                const topDiff = l * Math.sin(radian);
                const leftDiff = l - l * Math.cos(radian);
                courseware = updatePickedBlocks(courseware, value => value + pole * topDiff, ['props', 'position', 'top'], blockIndexed);
                courseware = updatePickedBlocks(courseware, value => value - needMoveX * moveX - pole * leftDiff, ['props', 'position', 'left'], blockIndexed);
                return courseware;
            }

            const vertialMove = (courseware, nextHeight) => {
                // 方向差异修正系数
                const pole = /s/.test(resizeDirection) ? -1 : 1; // 拉伸方向不同时方位正增长还是负增长
                const needMoveY = /s/.test(resizeDirection) ? 0 : 1;

                const moveY = nextHeight - height;
                courseware = updatePickedBlocks(courseware, () => nextHeight, ['props', 'size', 'height'], blockIndexed);

                // 有旋转时拉伸修正top,left
                const l = moveY / 2;
                const radian = rotation * Math.PI / 180;
                const leftDiff = l * Math.sin(radian);
                const topDiff = l - l * Math.cos(radian);
                if (isCorner) {
                    courseware = updatePickedBlocks(courseware, value => value - moveY * needMoveY + pole * topDiff, ['props', 'position', 'top'], blockIndexed);
                    courseware = updatePickedBlocks(courseware, value => value + pole * leftDiff, ['props', 'position', 'left'], blockIndexed);
                } else {
                    courseware = updatePickedBlocks(courseware, value => value - moveY * needMoveY + pole * topDiff, ['props', 'position', 'top'], blockIndexed);
                    courseware = updatePickedBlocks(courseware, value => value + pole * leftDiff, ['props', 'position', 'left'], blockIndexed);
                }
                return courseware;
            }

            let nextWidth = 0;
            let nextHeight = 0;
            if (/e/.test(resizeDirection)) {
                nextWidth = width + moveX > MIN_BLOCK_WIDTH ? width + moveX : MIN_BLOCK_WIDTH; // 小于最小宽度按最小宽度计算
                courseware = horitonalMove(courseware, nextWidth);
                isCorner = true;
            }
            if (/w/.test(resizeDirection)) {
                nextWidth = width - moveX > MIN_BLOCK_WIDTH ? width - moveX : MIN_BLOCK_WIDTH; // 小于最小宽度按最小宽度计算
                courseware = horitonalMove(courseware, nextWidth);
                isCorner = true;
            }

            if (shiftKey) { // 点击shift键拉伸，保持宽高比不变
                nextHeight = nextWidth / width * height;
            }

            if (/n/.test(resizeDirection)) {
                if (type === 'text' || type === 'table') return; // 文本元素和表格元素不能手动改变高度
                if (!shiftKey) {
                    nextHeight = height - moveY > MIN_BLOCK_HEIGHT ? height - moveY : MIN_BLOCK_HEIGHT; // 小于最小高度按最小高度计算
                }
                courseware = vertialMove(courseware, nextHeight);
            }
            if (/s/.test(resizeDirection)) {
                if (type === 'text' || type === 'table') return; // 文本元素和表格元素不能手动改变高度
                if (!shiftKey) {
                    nextHeight = height + moveY > MIN_BLOCK_HEIGHT ? height + moveY : MIN_BLOCK_HEIGHT; // 小于最小高度按最小高度计算
                }
                courseware = vertialMove(courseware, nextHeight);
            }
        } else { // 旋转 TODO：旋转后的辅助线,组合习题框等功能待完善
            const centerX = block.getIn(['initStyle', 'centerX']);
            const centerY = block.getIn(['initStyle', 'centerY']);
            let x = pageX - centerX;
            let y = centerY - pageY;

            // let isUpdown = 1;
            // if (isGroupIndex(groupIndex)) {
            //     const parentRotation = getTheBlock(courseware, Map({
            //         index: groupIndex
            //     })).getIn(['props', 'rotation']);

            //     console.log(79, parentRotation);

            //     // const dirReverse = {
            //     //     'n': 's',
            //     //     'e': 'w',
            //     //     's': 'n',
            //     //     'w': 'e'
            //     // }
            //     // if (parentRotation > 90 && parentRotation < 270) {
            //     //     resizeDirection = resizeDirection.split('').map(value => dirReverse[value]).join('');
            //     //     console.log(80, resizeDirection)
            //     // }

            //     isUpdown = parentRotation > 90 && parentRotation < 270 ? -1 : 1;  // 旋转颠倒后
            // }

            // 计算旋转角度
            const rotateRadian = Math.atan(x / y);
            let rotateAngel = rotateRadian * 180 / Math.PI;
            if (y < 0) {
                rotateAngel += 180;
            } else if (y > 0 && x < 0) {
                rotateAngel += 360;
            }

            courseware = updatePickedBlocks(courseware, () => rotateAngel, ['props', 'rotation'], blockIndexed);
        }
    })

    /**
     * 对齐辅助线
     */
    if (isDraging) {
        guides = blockSnap(courseware, data).get('guides');
        courseware = blockSnap(courseware, data).get('courseware');
    }

    return Map({
        guides: guides,
        courseware: courseware
    })
}

/**
 * 生成block的style对象
 * @param {Map} block 属性对象
 * @param {Map} blockConfig 配置信息
 * @param {number} scale 缩放比
 */
const createStyle = (block, blockConfig, scale = 1) => {
    const props = Map.isMap(block) ? block.get('props') : block.props;
    const type = Map.isMap(block) ? block.get('type') : block.type;

    let style = {};
    blockConfig.forEach((collection, propName) => {
        const value = props.getIn(propName.split('.')); // 属性值
        if (value || (typeof value === 'number')) {
            if (List.isList(collection)) {
                collection.forEach((map, name) => {
                    const propValue = map.get('value')(value); // map: value处理函数， map: name 属性名
                    set(style, map.get('name'), propValue)
                })
            } else {
                const propValue = collection.get('value')(value); // collection: value处理函数， collection: name 属性名
                set(style, collection.get('name'), propValue)
            }
        }
    });

    ['left', 'top', 'width', 'height'].forEach(value => {
        if (style[value]) {
            style[value] = style[value].replace(/\d+/, value => value * scale)
        }
    })

    if (type === 'table' || type === 'text') {
        merge(style, {
            height: 'auto'
        })
    }

    if (type === 'shape') {
        unset(style, 'borderStyle');
        unset(style, 'borderWidth');
        unset(style, 'borderColor');
    }

    return style;
}

/**
 * 通过block的数据生成innerHTML
 * @param {*Map} block 元素的数据
 */
const blockToHTML = (block) => {
    const type = block.get('type');
    const toHTML = blockHtml.get(type);
    return toHTML(block)
}

/**
 * 通过id查找block数据
 * @param {*Map} courseware 课件数据
 * @param {*string} blockId
 */
const queryBlockById = (courseware, blockId) => {
    const slideIndex = courseware.getIn(['index', 'blocks', blockId]);
    const blocks = courseware.getIn(['ppt', 'slides', slideIndex, 'blocks']);
    const block = blocks.find(block => block.get('id') === blockId)
    return block;
}

/**
 * 更新zIndexs
 * @param {*Map} courseware 课件数据
 */
const refreshZindex = (courseware) => {
    const blocks = updateBlocks(courseware);
    const zIndexs = blocks.map(block => block.getIn(['props', 'zIndex']));
    courseware = courseware.setIn(['current', 'zIndexs'], zIndexs)
    return courseware;
}

/**
 * 更新id
 * @param {*Map} element 需要更新id的节点元素，可以是数组或者单个对象
 */
const updateId = (element) => {
    if (List.isList(element)) {
        return element.map(ele => ele.update('id', id => id.match(/^[^-]+-/)[0] + uuid.v4()));
    } else if (Map.isMap(element)) {
        return element.update('id', id => id.match(/^[^-]+-/)[0] + uuid.v4());
    }
    return element;
}

/**
 * 获取卡片所在练习中包含卡片的数量
 * @param {*object} courseware 课件数据
 * @param {*string | number | undefined} slideId 卡片标识 id或者索引,不传值表示当前卡片
 */
const getQuestionAmount = (courseware, slideId) => {
    // 卡片索引
    let slideIndex = 0;
    if (typeof slideId === 'string') { // 卡片id
        slideIndex = courseware.getIn(['ppt', 'slides']).findIndex(slide => slide.get('id') === slideId);
    } else if (typeof slideId === 'number') { // 卡片索引
        slideIndex = slideId;
    } else { // null 或者 undefined，取当前卡片索引
        slideIndex = courseware.getIn(['current', 'slideIndex']);
    }

    // 卡片对应练习
    const question = courseware.getIn(['ppt', 'slides', slideIndex, 'blocks']).find(block => block.get('isQuestion'));
    if (question) {
        const exercise = getExerciseByBlockId(courseware, question.get('id'));
        return exercise.get('questions').size;
    }

    return 0;
}

/**
 * 限制练习中包含卡片的数量
 */
const limitQuestionAmount = (config = {}) => fn => (courseware, action) => {
    let prevCourseware = courseware;
    courseware = fn(courseware, action);
    const {slideIndexInAction, type = 'addQuestion'} = config; // 配置参数，slideIndexInAction: 卡片索引在action中的字段；type：卡片数量超过限制的信息类型

    let slideIndex = 0;
    if (slideIndexInAction == null) {
        slideIndex = courseware.getIn(['current', 'slideIndex']); // 当前卡片索引
    } else {
        slideIndex = action[slideIndexInAction]; // 合并练习的卡片索引
    }

    if (getQuestionAmount(courseware, slideIndex) > MAXQUESTIONAMOUNT) {
        prevCourseware = prevCourseware.setIn(['current', 'questionOverNumber'], type)
        return prevCourseware;
    }
    return courseware;
}

export {
    refreshIndex, // 更新索引
    getBlockIdxes, // 获取一组block对应的slideIndex
    getLinkSlideIdxes, // 获取某个环节中slide对应的index
    getLinkIndexBySlideId, // 根据slideId获取环节索引
    getLinkIndexBySlideIndex, // 根据slideIndex获取环节索引
    createNewSlide, // 创建新卡片
    createNewLink, // 创建新环节
    createNewExercise, // 创建新练习
    getBlocks, // 获取当前slide的block数组
    updateQuestion, // 通过current中blockId更新question
    getMaxZindex, // 获取最大的zIndex
    deleteBlock, // 删除block
    applyIndex, // 更新block数组的zIndex
    deleteQuestion, // 删除习题截图
    isGroupIndex, // 判断groupIndex是否存在
    getFocusedBlock, // 获取当前被操作的唯一block
    handleSlideMouseMove, // slide上的鼠标移动事件处理
    createStyle, // 生成block的style对象
    updatePickedBlocks, // 更新页面被选中元素的状态
    getCurrentBlocks, // current中的blocks
    updateBlocks, // 对整个blocks数组进行操作
    getTheBlock, // 获取当前操作的唯一数组
    blockToHTML, // 通过block的数据生成innerHTML
    queryBlockById, // 通过id查找block数据
    refreshZindex, // 更新zIndexs
    updateId, // 更新id
    limitQuestionAmount // 限制练习中包含卡片的数量
}
