import {
    reformExercise,
    sortQuestions,
    handleAddQuestion
} from './exercise'
import {
    moveSlideToLink,
    deleteTeachingLink
} from './teachingLink'
import {
    changeGroupStyle
} from './questionBlock'
import {handleBlockMouseDown} from './baseBlock'
import {
    refreshIndex,
    getLinkSlideIdxes,
    getLinkIndexBySlideIndex,
    getLinkIndexBySlideId,
    createNewSlide,
    isGroupIndex,
    getTheBlock,
    refreshZindex,
    updateId
} from './helper';
import Immutable, {Map, List} from 'immutable';
import {SLIDE_BACKGROUND_COLOR} from '../../view/courseware/config/constant';

/**
 * 移动卡片
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const moveSlide = (courseware, action) => {
    let {sourceId, targetId, direction, part} = action;
    const slides = courseware.getIn(['ppt', 'slides']);
    const sourceIndex = slides.findIndex(slide => slide.get('id') === sourceId);
    if (targetId) {
        let targetIndex = slides.findIndex(slide => slide.get('id') === targetId);
        if (sourceIndex < targetIndex && part === 'top') {
            targetIndex--;
        } else if (sourceIndex > targetIndex && part === 'bottom') {
            targetIndex++;
        }
        return moveSlideNew(courseware, sourceIndex, targetIndex);
    } else {
        return upDownSlide(courseware, sourceId, direction);
    }
}

const upDownSlide = (courseware, sourceId, direction) => {
    const slides = courseware.getIn(['ppt', 'slides']);
    const sourceIndex = slides.findIndex(slide => slide.get('id') === sourceId);
    const offset = direction === 'up' ? -1 : 1;
    const targetIndex = sourceIndex + offset;
    const sourceLinkIndex = getLinkIndexBySlideIndex(courseware, sourceIndex);
    const targetLinkIndex = targetIndex < slides.size && getLinkIndexBySlideIndex(courseware, targetIndex);
    if (sourceLinkIndex !== targetLinkIndex) {
        return moveSlideToLink(courseware, {
            sourceSlideProps: {
                linkIndex: sourceLinkIndex,
                data: Map({id: sourceId})
            },
            targetLinkIndex: sourceLinkIndex + offset,
            onlyChangeLink: true
        })
    }

    return moveSlideNew(courseware, sourceIndex, targetIndex);
}

const moveSlideNew = (courseware, sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) {
        return courseware;
    }

    courseware = courseware.updateIn(
        ['ppt', 'slides'],
        slides => slides.splice(sourceIndex, 1).splice(targetIndex, 0, slides.get(sourceIndex))
    );

    // 处理current
    const current = courseware.get('current');
    const currentSlideIndex = current.get('slideIndex');
    if (currentSlideIndex === sourceIndex) {
        courseware = courseware.setIn(['current', 'slideIndex'], targetIndex);
    } else if (currentSlideIndex >= Math.min(sourceIndex, targetIndex) && currentSlideIndex <= Math.max(sourceIndex, targetIndex)) {
        courseware = courseware.updateIn(['current', 'slideIndex'], idx => idx + (sourceIndex > targetIndex ? 1 : -1))
    }

    courseware = refreshIndex(courseware);
    courseware = reformExercise(courseware);
    return courseware;
}

/**
 * 添加卡片
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const addSlide = (courseware, action) => {
    const currentLinkIndex = courseware.getIn(['current', 'linkIndex']);
    const idxes = getLinkSlideIdxes(courseware, currentLinkIndex);
    const lastSlideIndex = Math.max(...idxes);
    const newSlide = createNewSlide();
    courseware = courseware.updateIn(['ppt', 'slides'], slides => slides.splice(lastSlideIndex + 1, 0, newSlide));
    courseware = courseware.updateIn(['ppt', 'teachingLinks', currentLinkIndex, 'slides'], slides => slides.push(newSlide.get('id')));
    courseware = refreshIndex(courseware);
    courseware = reformExercise(courseware);
    ['zIndexs', 'blocks'].forEach((item) => {
        courseware = courseware.setIn(['current', item], Immutable.List());
    })
    return courseware.setIn(['current', 'slideIndex'], lastSlideIndex + 1);
}

/**
 * slide的鼠标mouseUp处理
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleSlideMouseUp = (courseware, action) => {
    const {data} = action;
    const current = data.get('current');
    const slide = data.get('slide');

    const blocks = courseware.getIn(['current', 'blocks']);
    const slideIndex = courseware.getIn(['current', 'slideIndex']);

    // 旋转后重新计算block的大小
    const isRotating = courseware.getIn(['current', 'isRotating']);
    if (isRotating) {

    }

    courseware = courseware.withMutations(courseware => {
        courseware
        .mergeDeep(Map({
            current: current
        }))
        .updateIn(['ppt', 'slides', slideIndex], value => {
            return value.mergeDeep(slide);  // move事件分离到组件中，在up后合回来到store
        })
        .setIn(['current', 'snapGuides'], List()) // 自动对齐辅助线不显示
    })

    if (blocks.get(0) && isGroupIndex(blocks.getIn([0, 'groupIndex']))) { // 组合习题更新外边框的大小
        courseware = changeGroupStyle(courseware);
    }

    // 如果拖拽元素中有习题，重新排列习题
    blocks.forEach(block => {
        const blockEntity = getTheBlock(courseware, block)
        const isQuestion = blockEntity.get('isQuestion');
        const blockId = blockEntity.get('id');
        if (isQuestion) {
            courseware = sortQuestions(courseware, blockId);
            return false
        }
    })
    return courseware;
}

/**
 * slide的鼠标mouseDown处理
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleSlideMouseDown = (courseware, action) => {
    const {data} = action;
    courseware = courseware.withMutations(courseware => { // current.blocks清空并更新current
        courseware
        .setIn(['current', 'blocks'], List())
        .mergeDeep(Map({
            current: data
        }))
    })
    return courseware;
}

/**
 * 更改slide切换动画
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const changeSlideAnimation = (courseware, action) => {
    const {data} = action;
    const slideIndex = courseware.getIn(['current', 'slideIndex']);
    courseware = courseware.updateIn(['ppt', 'slides', slideIndex, 'props', 'animation'], value => {
        return value.mergeDeep(data)
    })
    return courseware;
}

/**
 * 增删slide背景
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const addSlideBackground = (courseware, action) => {
    const {data} = action;
    courseware = changeSlideProps(courseware, ['background', 'image'], data.get('imgUrl'));
    return courseware;
}

const removeSlideBackground = (courseware) => {
    courseware = changeSlideProps(courseware, ['background', 'image'], '');
    return courseware;
}

/**
 * 增删slide颜色
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const addSlideBackgroundColor = (courseware, action) => {
    const {data} = action;
    courseware = changeSlideProps(courseware, ['background', 'color'], data.get('bgColor'));
    return courseware;
}

const removeSlideBackgroundColor = (courseware) => {
    courseware = changeSlideProps(courseware, ['background', 'color'], SLIDE_BACKGROUND_COLOR);
    return courseware;
}

/**
 * 更改当前所在slide对象的属性
 * @param {*object} courseware
 * @param {*iterable} path
 * @param {*object} props
 */
const changeSlideProps = (courseware, path, props) => {
    const slideIndex = courseware.getIn(['current', 'slideIndex']);
    courseware = courseware.setIn(['ppt', 'slides', slideIndex, 'props'].concat(path), props)
    return courseware;
}

/**
 * 删除卡片
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const deleteSlide = (courseware, action) => {
    if (courseware.getIn(['ppt', 'slides']).size < 2) return courseware;
    let {slideId} = action;
    let slideIndex = 0;
    if (!slideId) { // 如果没有给slideId，删除当前选中的slide
        slideIndex = courseware.getIn(['current', 'slideIndex']);
        slideId = courseware.getIn(['ppt', 'slides', slideIndex, 'id']);
    } else {
        slideIndex = courseware.getIn(['ppt', 'slides']).findIndex(slide => slide.get('id') === slideId);
    }
    const linkIndex = getLinkIndexBySlideId(courseware, slideId);
    const slidesOfLinkPath = ['ppt', 'teachingLinks', linkIndex, 'slides'];
    // 某环节中只有一个卡片时，把环节删除掉
    if (courseware.getIn(slidesOfLinkPath).size <= 1) {
        // 删除整个环节
        return deleteTeachingLink(courseware, {linkIndex});
    }

    courseware = courseware.withMutations(courseware => {
        courseware.updateIn(['ppt', 'slides'], slides => slides.splice(slideIndex, 1));
        // 去除teachingLink内的引用
        courseware.updateIn(slidesOfLinkPath, slides => slides.splice(slides.indexOf(slideId), 1));
        // 处理current
        courseware.updateIn(['current', 'slideIndex'], csi => (csi > 0 && csi >= slideIndex) ? --csi : csi);
    });

    courseware = refreshIndex(courseware);
    courseware = reformExercise(courseware);
    courseware = refreshZindex(courseware);
    return courseware;
}

/**
 * 切换卡片
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const slideTo = function (courseware, action) {
    const slideId = Map.isMap(action) ? action.get('slideId') : action.slideId;
    const ppt = courseware.get('ppt');
    const slides = ppt.get('slides');
    const slideIndex = slides.findIndex(slide => slide.get('id') === slideId);
    const linkIndex = getLinkIndexBySlideId(courseware, slideId);
    courseware = courseware.withMutations(courseware => {
        courseware
        .setIn(['current', 'linkIndex'], linkIndex)
        .setIn(['current', 'slideIndex'], slideIndex)
        .setIn(['current', 'blocks'], List())
    });

    return refreshZindex(courseware)
}

/**
 * 刷新卡片缩略图
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const refreshSlideThumnail = function (courseware, action) {
    const {slideId, canvas} = action;
    const slideIndex = courseware.getIn(['ppt', 'slides']).findIndex(slide => slide.get('id') === slideId);
    return courseware.setIn(['ppt', 'slides', slideIndex, 'thumnail'], canvas);
}

/**
 * 更改slideIndex
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleChangeSlideIndex = function (courseware, action) { // 点击翻页控制器改变slideIndex
    // const {data: {slideIndex}} = action;
    const {data} = action;
    const slideIndex = data.get('slideIndex');
    courseware = courseware.withMutations(courseware => {
        courseware
        .setIn(['current', 'slideIndex'], slideIndex)
        .updateIn(['current', 'blocks'], blocks => blocks.clear())
    })

    return refreshZindex(courseware);
}

/**
 * 全选 ctrl + A
 * @param {*Map} courseware 课件数据
 * @param {*object} action
 */
const handleSelectAll = (courseware, action) => {
    const slideIndex = courseware.getIn(['current', 'slideIndex']);
    courseware.getIn(['ppt', 'slides', slideIndex, 'blocks']).forEach((block, index) => {
        courseware = handleBlockMouseDown(courseware, {data: Map({
            index: index,
            blockId: block.get('id'),
            newProperty: Map({
                shiftKey: true
            })
        })})
    })
    return courseware;
}

/**
 * 复制卡片
 * @param {*Map} courseware 课件数据
 * @param {*object} action
 */
const handleCopySlide = (courseware, action) => {
    const {id} = action;
    // 环节索引
    const teachingLinkIndex = courseware.getIn(['ppt', 'teachingLinks']).findIndex(link => link.get('slides').some(value => value === id));
    // 环节下待复制卡片的索引
    const linkSlideIndex = courseware.getIn(['ppt', 'teachingLinks', teachingLinkIndex, 'slides']).findIndex(value => value === id);
    // 卡片索引
    const slideIndex = courseware.getIn(['index', 'slides', id]);
    // 待复制的卡片
    let slide = courseware.getIn(['ppt', 'slides', slideIndex]);
    // 更新卡片的id
    slide = updateId(slide);
    // 更新blocks的id
    slide = slide.update('blocks', blocks => updateId(blocks));
    // 卡片添加到环节中
    courseware = courseware.updateIn(['ppt', 'teachingLinks', teachingLinkIndex, 'slides'], slides => slides.splice(linkSlideIndex, 0, slide.get('id')));
    // 卡片添加到slides中
    courseware = courseware.updateIn(['ppt', 'slides'], slides => slides.splice(slideIndex, 0, slide));

    courseware = refreshIndex(courseware);
    // 添加可能有的习题
    slide.get('blocks').forEach(block => {
        if (block.get('isQuestion')) {
            courseware = handleAddQuestion(courseware, Immutable.Map({
                blockId: block.get('id')
            }), Immutable.List().setSize(1))
        }
    })

    return courseware;
}

export {
    moveSlide,
    addSlide,
    handleSlideMouseUp,
    handleSlideMouseDown,
    changeSlideAnimation,
    addSlideBackground,
    addSlideBackgroundColor,
    removeSlideBackgroundColor,
    removeSlideBackground,
    deleteSlide,
    slideTo,
    refreshSlideThumnail,
    handleChangeSlideIndex,
    handleSelectAll,
    handleCopySlide
}
