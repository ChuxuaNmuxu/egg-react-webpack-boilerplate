/**
 * 块元素基本处理逻辑
 */
import {
    refreshIndex,
    getMaxZindex,
    deleteBlock,
    applyIndex,
    isGroupIndex,
    getCurrentBlocks,
    updateBlocks,
    updatePickedBlocks,
    getTheBlock,
    limitQuestionAmount
} from './helper';
import {
    commonBlockConfig
} from './config'
import {
    handleAddQuestion,
    handleClearQuestion,
    addQuestionToExercise
} from './exercise'
import {initialTableHtml} from './tableBlock'
import uuid from 'uuid';
import {ROTATION_LINE_LENGTH, TABLE_ROW_HEIGHT, COPY_POSITION_DIFF, SLIDE_WIDTH, SLIDE_HEIGHT, SVG_COLOR} from '../../view/courseware/config/constant';

import {fromJS, Map, List, Seq} from 'immutable';

// const {log} = console;
/**
 * 块元素点击
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleBlockMouseDown = (courseware, action) => {
    let {data} = action;
    const index = data.get('index');
    const blockId = data.get('blockId');
    const groupIndex = data.get('groupIndex');

    const block = Map().withMutations(map => {
        map.set('index', index).set('blockId', blockId).set('groupIndex', groupIndex)
    })

    const isMember = isGroupIndex(groupIndex); // true: 当前点击的是组合习题中的member
    const isShift = data.getIn(['newProperty', 'shiftKey']); // true: 按住了shift或者ctrl键

    const blockPicked = courseware.getIn(['current', 'blocks']); // 已经被选中的block
    const isDuplicateSelect = blockPicked.some((block) => block.get('groupIndex') === groupIndex && block.get('index') === index); // true: 被点击的block已经是选中状态了
    const isMemberPicked = blockPicked.some((block) => isGroupIndex(block.get('groupIndex'))); // true: 已有member元素被选中

    if (isMember) { // 组合习题元素被选中是跟新memberZIndexs
        const slideIndex = courseware.getIn(['current', 'slideIndex']);
        const members = courseware.getIn(['ppt', 'slides', slideIndex, 'blocks', groupIndex, 'members']);
        courseware = courseware.setIn(['current', 'memberZIndexs'], members.map(block => block.getIn(['props', 'zIndex'])));
    }

    /**
     * 判断哪些元素将被选中
     */
    const needDelete = isShift && !isMember && !isMemberPicked && courseware.getIn(['current', 'blocks']).size > 1; // 非member元素重复选取
    if (!isDuplicateSelect) { // 不是重复选取
        if (isShift && !isMember && !isMemberPicked) { // 非member元素的多选
            courseware = courseware.updateIn(['current', 'blocks'], value => value.push(block))
        } else {
            courseware = courseware.setIn(['current', 'blocks'], List([block]))
        }
    } else if (needDelete) { // 非member元素重复选取
        const blockIndex = courseware.getIn(['current', 'blocks']).findIndex(value => value.get('index') === index);
        courseware = courseware.updateIn(['current', 'blocks'], value => value.delete(blockIndex))
    }

    /**
     * 保存被选中元素的初始状态,因为不确定用户是否已经对选中的block做过操作，所以每次点击时都先保存下初始状态
     */
    const blocks = updateBlocks(courseware); // 当前页的blocks
    const currentBlock = courseware.getIn(['current', 'blocks']); // current 中的block数据
    currentBlock.forEach((block, index) => {
        let currentProps = getTheBlock(courseware, block).get('props');

        const height = currentProps.getIn(['size', 'height']);
        const rotation = currentProps.get('rotation');

        //  block的中心位置，用于旋转的计算
        const initPageX = data.getIn(['newProperty', 'initPageX']);
        const initPageY = data.getIn(['newProperty', 'initPageY']);
        const lineLength = ROTATION_LINE_LENGTH + height / 2;
        const centerX = initPageX - lineLength * Math.sin(rotation * Math.PI / 180);
        const centerY = initPageY + lineLength * Math.cos(rotation * Math.PI / 180);

        const initStyle = Map().withMutations(map => { // 保存点击时的初始状态
            map
            .set('centerX', centerX)
            .set('centerY', centerY)
        })

        courseware = courseware.setIn(['current', 'blocks', index, 'initStyle'], initStyle);
    })
    courseware = courseware.mergeIn(['current'], data.get('newProperty'));

    /**
     * 辅助对齐需要的位置信息,
     */
    courseware = courseware.setIn(['current', 'snapBounds'], List());
    const otherBlocks = blocks.filterNot(block => currentBlock.some(item => item.get('blockId') === block.get('id')));
    console.log(89, otherBlocks.toJS())
    if (!isMember) {
        if (blocks.size > currentBlock.size) {
            otherBlocks.forEach((block, blockIndex) => { // 将除了移动的block外的所有block的位置信息储存到spanBounds中
                // if (index === blockIndex) return;
                const left = block.getIn(['props', 'position', 'left']);
                const top = block.getIn(['props', 'position', 'top']);
                const height = block.getIn(['props', 'size', 'height']);
                const width = block.getIn(['props', 'size', 'width']);

                courseware = courseware.updateIn(['current', 'snapBounds'], snap => snap.push(Map({
                    left: left,
                    center: left + width / 2,
                    right: left + width,
                    top: top,
                    middle: top + height / 2,
                    bottom: top + height
                })))
            })
        }
        courseware = courseware.updateIn(['current', 'snapBounds'], snap => snap.push(Map({ // 增加和边界对齐的信息
            left: 0,
            center: 0,
            right: SLIDE_WIDTH,
            top: 0,
            middle: 0,
            bottom: SLIDE_HEIGHT
        })))
    }

    return courseware;
}

/**
 * 增加块状元素
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const createBlock = (data) => {
    let blockConfig = Map({ // 添加的block的配置信息
        text: Map({
            type: 'text',
            content: data.get('content') || '',
            'props.size.height': 34,
            'props.size.width': 600,
            'props.position.left': (SLIDE_WIDTH - 600) / 2,
            'props.position.top': (SLIDE_HEIGHT - 34) / 2
        }),
        image: Map({
            type: 'image',
            'props.size.width': data.get('width'),
            'props.size.height': data.get('height'),
            'props.position.left': data.get('left'),
            'props.position.top': data.get('top'),
            url: data.get('imgUrl'),
            initHeight: data.get('initHeight'),
            initWidth: data.get('initWidth')
        }),
        shape: Map({
            type: 'shape',
            shapeType: data.get('shapeType'),
            'props.size.width': 200,
            'props.size.height': 200,
            'props.position.left': (SLIDE_WIDTH - 200) / 2,
            'props.position.top': (SLIDE_HEIGHT - 200) / 2,
            'props.color': SVG_COLOR
        }),
        table: Map({
            type: 'table',
            'props.size.height': data.get('height'),
            'props.row': data.get('row'),
            'props.column': data.get('column'),
            tableArr: data.get('tableArr'),
            content: initialTableHtml(data.get('row'), data.get('column'))
            // 'props.position.left': ,
            // 'props.position.top': (SLIDE_HEIGHT - 200) / 2
        })
    })
    let block = Map();
    blockConfig.get(data.get('blockType')).forEach((value, key) => { // 根据blockType生成嵌套的单个block个性配置，merge到commonConfig
        block = block.setIn(key.split('.'), value);
    })
    return block;
}

// block的位置信息，0：无法在添加是确定
const blockPosition = {
    text: {
        width: 600,
        height: 34
    },
    shape: {
        width: 200,
        height: 200
    },
    table: {
        width: 600,
        height: 0
    },
    image: {
        width: 0,
        height: 0
    }
}

const handleAddBlock = (courseware, action) => {
    let {data} = action;
    const blockType = data.get('blockType');

    /**
     * 更新页面的zIndexs数组，增加一个最大值
     */
    const zIndexMax = getMaxZindex(courseware);
    courseware = courseware.updateIn(['current', 'zIndexs'], value => value.push(zIndexMax + 1))

    /**
     * 新增一条block数据
     */
    const commonConfig = fromJS(commonBlockConfig).mergeDeep(Map({ // block的公共数据
        id: 'block-' + uuid.v4(),
        props: Map({
            zIndex: zIndexMax + 1
        })
    }))

    data = data.mergeWith((preValue, nextValue) => { // 位置信息
        if (nextValue === 0) {
            return preValue
        }
        return nextValue
    }, fromJS(blockPosition[blockType]));

    if (blockType === 'table') { // table元素生成一个二维数组保存内容
        let tableArr = List().setSize(data.get('row'));
        tableArr = tableArr.map(value => {
            return List().setSize(data.get('column'))
        })
        data = data.withMutations(data => {
            data
            .set('tableArr', tableArr)
            .set('height', TABLE_ROW_HEIGHT * data.get('row'))
        })
    } else if (blockType === 'image') { // 图片元素尺寸超过编辑区缩放到编辑区内显示
        data = scaleImage(data);
    }

    // 根据blockType, 新增block数据
    const blockConfig = createBlock(data);

    const width = data.get('width');
    const height = data.get('height');
    const left = data.get('left');
    const top = data.get('top');
    const blockLeft = left || (SLIDE_WIDTH - width) / 2;
    const blockTop = top || (SLIDE_HEIGHT - height) / 2;

    let newBlock = commonConfig.withMutations(config => { // 添加元素位置没有设定则居中
        config
        .mergeDeep(blockConfig)
        .setIn(['props', 'position', 'left'], blockLeft)
        .setIn(['props', 'position', 'top'], blockTop)
    })

    courseware = updateBlocks(courseware, value => {
        return value.push(newBlock)
    })

    courseware = refreshIndex(courseware, 'blocks');
    return courseware;
}

/**
 * 图片尺寸超过卡片后，等比例缩放，计算图片的最小缩放比: 拉伸(缩放)后宽高 / 拉伸(缩放)前宽高
 * @param {*Map} data
 */
const imgScaleRadio = (data) => {
    let scale = 1;
    const width = data.get('width');
    const height = data.get('height');

    if (width > SLIDE_WIDTH && height <= SLIDE_HEIGHT) { // 高度跟随宽度缩放
        scale = SLIDE_WIDTH * 0.95 / width;
    } else if (width <= SLIDE_WIDTH && height > SLIDE_HEIGHT) { // 宽度跟随高度缩放
        scale = SLIDE_HEIGHT * 0.95 / height;
    } else if (width > SLIDE_WIDTH && height > SLIDE_HEIGHT) { // 取最小缩放比
        const widthScaleRadio = SLIDE_WIDTH * 0.95 / width;
        const heightScaleRadio = SLIDE_HEIGHT * 0.95 / height;

        scale = Math.min(widthScaleRadio, heightScaleRadio);
    }
    return scale;
}

/**
 * 图片尺寸超过卡片后，等比例缩放
 * @param {*Map} data 图片宽高数据
 */
const scaleImage = (data) => {
    const width = data.get('width');
    const height = data.get('height');
    let scaleRadio = 1;
    if (width > SLIDE_WIDTH || height > SLIDE_HEIGHT) { // 图片尺寸过大，等比缩放到卡片内显示
        scaleRadio = imgScaleRadio(data)
    }

    data = data.withMutations(data => {
        data
        .set('width', width * scaleRadio)
        .set('height', height * scaleRadio)
        .set('initWidth', width)
        .set('initHeight', height)
    })

    return data;
}

/**
 * 删除块状元素
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleDeleteBlock = (courseware, action) => {
    courseware = deleteBlock(courseware).get('courseware');
    return courseware;
}

/**
 * 复制块状元素
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleCopyBlock = (courseware, action) => {
    const blocks = getCurrentBlocks(courseware);
    const slideIndex = courseware.getIn(['current', 'slideIndex']);
    courseware = courseware.updateIn(['current', 'copys'], copy => {
        return blocks.map(block => {
            const groupIndex = block.get('groupIndex');
            let index = block.get('index');
            if (isGroupIndex(groupIndex)) {
                index = groupIndex;
            }
            return courseware.getIn(['ppt', 'slides', slideIndex, 'blocks', index])
        })
    })

    return courseware;
}

/**
 * 粘贴块状元素
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handlePasteBlock = (courseware, action) => limitQuestionAmount()((courseware, action) => {
    let zIndexMax = getMaxZindex(courseware);
    let zIndexAdd = List();
    courseware = courseware.withMutations(courseware => {
        courseware
        .updateIn(['current', 'copys'], copys => { // 更新copys的id,位置和zIndex，使得每次复制出的block位置错开,zIndex不重复
            return copys.map(copy => {
                zIndexAdd = zIndexAdd.push(++zIndexMax)
                return copy.withMutations(value => {
                    value
                    .set('id', `block-${uuid.v4()}`)
                    .updateIn(['props', 'position', 'left'], value => value + COPY_POSITION_DIFF)
                    .updateIn(['props', 'position', 'top'], value => value + COPY_POSITION_DIFF)
                    .updateIn(['props', 'zIndex'], value => zIndexMax)
                })
            })
        })
        .updateIn(['ppt', 'slides', courseware.getIn(['current', 'slideIndex']), 'blocks'], value => value.concat(courseware.getIn(['current', 'copys']))) // 复制的block加到courseware
        .updateIn(['current', 'zIndexs'], value => value.concat(zIndexAdd)) // 更新zIndex数组
    })

    courseware = refreshIndex(courseware, 'blocks');

    courseware.getIn(['current', 'copys']).forEach(block => {
        if (block.get('isQuestion')) {
            courseware = addQuestionToExercise(courseware, Map({
                blockId: block.get('id')
            }))
        }
    })

    return courseware;
})(courseware, action)

/**
 * 切换block为可编辑状态
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const blockEditor = (courseware, action) => {
    const {data} = action;
    courseware.current.blocks = [];
    courseware.current.blocks.push({
        index: data.index,
        isEditing: true
    })
    return courseware;
}

/**
 * block的快捷按钮操作
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleQuickFactory = (courseware, data) => { // 快捷操作的函数配置
    const index = data.get('index');
    console.log(76, index)
    const slideIndex = courseware.getIn(['current', 'slideIndex']);
    const blockEntity = courseware.getIn(['ppt', 'slides', slideIndex, 'blocks', index]); // 被操作的block数据
    if (data.get('type') !== 'question') {
        courseware = courseware.updateIn(['current', 'blocks'], blocks => { // 快捷操作默认只操作当前元素，所以将其他选中元素过滤掉
            return blocks.filter(block => block.get('index') === index)
        })
    }

    const config = Seq({
        copy: () => {
            courseware = courseware.updateIn(['current', 'copys'], value => { // 将当前操作的block更新到copys数组中
                return value.withMutations(value => {
                    value
                    .clear()
                    .push(blockEntity)
                })
            })
            return handlePasteBlock(courseware) // 粘贴
        },
        rotation: () => {
            const rotation = data.get('rotation');
            return courseware.updateIn(['ppt', 'slides', slideIndex, 'blocks', index, 'props', 'rotation'], value => value + rotation)
        },
        crop: () => {
            return courseware.update('current', current => {
                return current.withMutations(current => {
                    current
                    .set('isCrop', true)
                    .setIn(['blocks', 0, 'src'], blockEntity.get('url'))
                })
            })
        },
        zIndexUp: () => {
            return zIndexUp(courseware)
        },
        zIndexDown: () => {
            return zIndexDown(courseware)
        },
        zIndexTop: () => {
            const zIndexMax = getMaxZindex(courseware);
            return zIndexUp(courseware, null, (value, zIndex) => {
                if (value === zIndex) {
                    return zIndexMax
                } else if (value > zIndex) {
                    return --value
                }
                return value
            })
        },
        zIndexBottom: () => {
            const zIndexMin = courseware.getIn(['current', 'zIndexs']).min();
            return zIndexDown(courseware, null, (value, zIndex) => {
                if (value === zIndex) {
                    return zIndexMin
                } else if (value < zIndex) {
                    return ++value
                }
                return value
            })
        },
        delete: () => {
            return deleteBlock(courseware, List([Map({index: index})])).get('courseware');
        },
        question: () => {
            return limitQuestionAmount()(handleAddQuestion)(courseware, data)
        },
        // 'clear': handleClearQuestion(courseware, data),
        clear: () => {
            return handleClearQuestion(courseware, data);
        }
    })

    return config;
}

const handleBlockQuickOption = (courseware, action) => {
    // action = fromJS(action);
    // let data = action.get('data');
    let {data} = action;
    let type = data.get('type');
    if (/deg/.test(type)) {
        data = data.set('rotation', parseInt(type));
        type = 'rotation';
    }
    const handleConfig = handleQuickFactory(courseware, data);
    const handle = handleConfig.get(type);
    if (handle) return handle();
    return courseware
}

/**
 * 改变zIndex
 * @param {Map} courseware 课件数据
 * @param {function} fn 回调函数
 */

const zIndexUp = (courseware, action, fn) => {
    if (!fn) {
        fn = (value, zIndex) => { // 将选中元素的zIndex和zIndex + 1的位置调换
            if (value === zIndex) {
                return ++value
            } else if (value === zIndex + 1) {
                return --value
            }
            return value
        }
    }
    const zIndex = getTheBlock(courseware).getIn(['props', 'zIndex']); // 选中元素的zIndex

    const groupIndex = courseware.getIn(['current', 'blocks', 0, 'groupIndex']);
    const isMember = isGroupIndex(groupIndex); // 操作对象是组合习题内的member元素

    const zIndexMax = getMaxZindex(courseware, isMember);
    if (zIndex === zIndexMax) return courseware // 如果zIndex已经是最大值了，不做操作

    if (isMember) {
        courseware = courseware.updateIn(['current', 'memberZIndexs'], zIndexs => {
            return zIndexs.map((value) => {
                return fn(value, zIndex)
            })
        })
    } else {
        courseware = courseware.updateIn(['current', 'zIndexs'], zIndexs => {
            return zIndexs.map((value) => {
                return fn(value, zIndex)
            })
        })
    }
    return applyIndex(courseware, groupIndex);
}

const zIndexDown = (courseware, action, fn) => {
    if (!fn) {
        fn = (value, zIndex) => {
            if (value === zIndex) {
                return --value
            } else if (value === zIndex - 1) {
                return ++value
            }
            return value
        }
    }

    const zIndex = getTheBlock(courseware).getIn(['props', 'zIndex']); // 选中元素的zIndex

    const groupIndex = courseware.getIn(['current', 'blocks', 0, 'groupIndex']);
    const isMember = isGroupIndex(groupIndex); // 操作对象是组合习题内的member元素

    let zIndexs = courseware.getIn(['current', 'zIndexs']);
    if (isMember) {
        zIndexs = courseware.getIn(['current', 'memberZIndexs']);
    }
    const zIndexMin = zIndexs.min(); // 最小zIndex

    if (zIndex === zIndexMin) return courseware // 如果zIndex已经是最大值了，不做操作

    if (isMember) {
        courseware = courseware.updateIn(['current', 'memberZIndexs'], zIndexs => {
            return zIndexs.map((value) => {
                return fn(value, zIndex)
            })
        })
    } else {
        courseware = courseware.updateIn(['current', 'zIndexs'], zIndexs => {
            return zIndexs.map((value) => {
                return fn(value, zIndex)
            })
        })
    }
    return applyIndex(courseware, groupIndex);
}

/**
 * 改变block的属性值
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */

const setBlockProps = (courseware, action) => {
    const prevCourseware = courseware;
    let {data} = action;
    let value = data.get('value');
    const prop = data.get('prop');

    value = /^-?\d+$/.test(value) && typeof value === 'string' ? parseInt(value) : value; // 将输入的string类型转化成number类型

    courseware = updatePickedBlocks(courseware, block => {
        return block.setIn(['props'].concat(prop.split('.')), value)
    })

    // 改变border时，改变width和height，保持元素的内容区大小不变
    if (prop === 'border.width' || prop === 'border.style') {
        // border改变前属性
        const block = getTheBlock(prevCourseware);
        const borderWidth = block.getIn(['props', 'border', 'width']);
        const borderStyle = block.getIn(['props', 'border', 'style']);
        const width = block.getIn(['props', 'size', 'width']);
        const height = block.getIn(['props', 'size', 'height']);

        const contentWidth = hasBorderStyle(borderStyle) ? width - borderWidth * 2 : width;
        const contentHeight = hasBorderStyle(borderStyle) ? height - borderWidth * 2 : height;

        // border改变后属性
        const blockNext = getTheBlock(courseware);
        const borderStyleNext = blockNext.getIn(['props', 'border', 'style']);
        const borderWidthNext = hasBorderStyle(borderStyleNext) ? blockNext.getIn(['props', 'border', 'width']) : 0;

        // 改变width和height，依据为保持元素的内容区大小不变
        if (block.get('type') !== 'shape') {
            courseware = updatePickedBlocks(courseware, size => {
                return size.withMutations(size => {
                    size
                    .update('width', width => contentWidth + borderWidthNext * 2)
                    .update('height', height => contentHeight + borderWidthNext * 2)
                })
            }, ['props', 'size'])
        }
    }

    return courseware;
}

const hasBorderStyle = (style) => {
    return !!style && style !== 'none';
}

/**
 * 更改动画类型
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const changeAnimationEffect = (courseware, action) => {
    let {data} = action;
    return updatePickedBlocks(courseware, block => {
        return block.setIn(['props', 'animation', 'effect'], data.get('effect'));
    })
}

/**
 * 更改元素外边框
 * @param {*Map} courseware 课件数据
 * @param {*object} action
 */
const handleChangeWrapBlock = (courseware, action) => {
    let {data} = action;
    courseware = updatePickedBlocks(courseware, block => {
        data.forEach((value, key) => {
            block = block.setIn(['props'].concat(key.split('.')), value);
        })
        return block;
    })
    return courseware
}

export {
    handleBlockMouseDown,
    handleAddBlock,
    handleDeleteBlock,
    handleCopyBlock,
    handlePasteBlock,
    blockEditor,
    handleBlockQuickOption,
    zIndexUp,
    zIndexDown,
    setBlockProps,
    changeAnimationEffect,
    imgScaleRadio,
    scaleImage,
    handleChangeWrapBlock
}
