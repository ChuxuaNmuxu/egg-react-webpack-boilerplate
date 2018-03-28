/**
 * 教学环节处理逻辑
 */
import Immutable from 'immutable';

import {
    refreshIndex,
    getLinkSlideIdxes,
    createNewSlide,
    createNewLink,
    updateId
} from './helper';
import {
    reformExercise,
    handleAddQuestion
} from './exercise'

/**
 * 交换环节
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const exchangeLink = (courseware, action) => {
    const {sourceIndex, targetIndex} = action;
    let linkIndex = courseware.getIn(['current', 'linkIndex']);
    const sourceIdxes = getLinkSlideIdxes(courseware, sourceIndex);
    const targetIdxes = getLinkSlideIdxes(courseware, targetIndex);
    courseware = courseware.withMutations(courseware => {
        // 批量调换slides位置
        const sourceSlides = courseware.getIn(['ppt', 'slides']).slice(Math.min(...sourceIdxes), Math.max(...sourceIdxes) + 1);
        courseware.updateIn(
            ['ppt', 'slides'],
            slides => slides
                .splice(Math.min(...sourceIdxes), sourceIdxes.length)
                .splice(
                    sourceIndex > targetIndex ? Math.min(...targetIdxes) : Math.max(...targetIdxes) + 1 - sourceIdxes.length,
                    0,
                    ...sourceSlides.toArray()
                )
        );
        // 调换环节位置
        courseware.updateIn(
            ['ppt', 'teachingLinks'],
            teachingLinks => teachingLinks
                .splice(sourceIndex, 1)
                .splice(targetIndex, 0, courseware.getIn(['ppt', 'teachingLinks', sourceIndex]))
        );
    });

    // 处理current
    const cindex = [sourceIndex, targetIndex].indexOf(linkIndex);
    if (cindex > -1) {
        const current = courseware.get('current').withMutations(current => {
            current.set('linkIndex', [sourceIndex, targetIndex][1 - cindex]);
            // 处理slide
            const diff = targetIndex - sourceIndex;
            if (linkIndex === sourceIndex) {
                current.updateIn(['slideIndex'], slideIndex => slideIndex + targetIdxes.length * (diff / Math.abs(diff)));
            } else {
                current.updateIn(['slideIndex'], slideIndex => slideIndex - sourceIdxes.length * (diff / Math.abs(diff)));
            }
        });
        courseware = courseware.mergeIn(['current'], current);
    }
    courseware = refreshIndex(courseware);
    courseware = reformExercise(courseware);
    return courseware;
}

const getTargetSlideIndex = (courseware, targetLinkIndex, slideIndex) => {
    let targetIndex = 0;
    if (courseware.getIn(['ppt', 'teachingLinks', targetLinkIndex, 'slides']).size) {
        const idxes = getLinkSlideIdxes(courseware, targetLinkIndex);
        const minIdx = Math.min(...idxes);
        targetIndex = minIdx - Number(slideIndex < minIdx);
    } else {
        if (targetLinkIndex > 0) {
            // 往前取
            let idxes;
            let prevLinkIndex = targetLinkIndex - 1;
            do {
                idxes = getLinkSlideIdxes(courseware, prevLinkIndex);
                prevLinkIndex--;
            } while (!idxes.length && prevLinkIndex >= 0);
            if (idxes.length) {
                const maxIdx = Math.max(...idxes);
                targetIndex = maxIdx + (Number(slideIndex > maxIdx));
            }
        }
    }
    return targetIndex;
}

/**
 * 移动卡片到环节
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const moveSlideToLink = (courseware, action) => {
    const {sourceSlideProps: {linkIndex, data}, targetLinkIndex, onlyChangeLink} = action;
    const slideId = data.get('id')
    return courseware.withMutations(courseware => {
        console.log(89)
        const slides = courseware.getIn(['ppt', 'slides']);
        const slideIndex = slides.findIndex(slide => slide.get('id') === slideId);
        let targetIndex;
        if (!onlyChangeLink) {
            // 处理slides，移到环节第一位
            targetIndex = getTargetSlideIndex(courseware, targetLinkIndex, slideIndex);
            (slideIndex === targetIndex) || courseware.updateIn(
                ['ppt', 'slides'],
                slides => slides.splice(slideIndex, 1).splice(targetIndex, 0, slides.get(slideIndex))
            )
        }

        // 处理环节
        courseware.updateIn(['ppt', 'teachingLinks', targetLinkIndex, 'slides'], slides => slides.push(slideId));
        const sourceSlidesPath = ['ppt', 'teachingLinks', linkIndex, 'slides'];
        const slideIndexInSourceLink = courseware.getIn(sourceSlidesPath).indexOf(slideId);
        courseware.updateIn(sourceSlidesPath, slides => slides.splice(slideIndexInSourceLink, 1));

        // 处理current
        const currentSlideIndex = courseware.getIn(['current', 'slideIndex']);
        if (currentSlideIndex === slideIndex) {
            courseware.setIn(['current', 'linkIndex'], targetLinkIndex);
        }
        if (!onlyChangeLink) {
            if (currentSlideIndex === slideIndex) {
                courseware.setIn(['current', 'slideIndex'], targetIndex);
            } else if (currentSlideIndex >= Math.min(slideIndex, targetIndex) && currentSlideIndex <= Math.max(slideIndex, targetIndex)) {
                courseware.updateIn(['current', 'slideIndex'], idx => idx + (slideIndex > targetIndex ? 1 : -1))
            }
        }
    });
}

/**
 * 添加环节
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const addTeachingLink = (courseware, action) => {
    const newSlide = createNewSlide();
    const newLink = createNewLink();
    courseware = courseware.withMutations(courseware => {
        courseware
        .updateIn(['ppt', 'slides'], slides => slides.push(newSlide))
        .updateIn(['ppt', 'teachingLinks'], teachingLinks => teachingLinks.push(
            newLink.update('slides', slides => slides.push(newSlide.get('id')))
        ))
        .updateIn(['current', 'blocks'], blocks => blocks.clear())
        .updateIn(['current', 'zIndexs'], zIndexs => zIndexs.clear())
    });
    courseware = refreshIndex(courseware);
    courseware = courseware.mergeIn(['current'], Immutable.Map({
        linkIndex: courseware.getIn(['ppt', 'teachingLinks']).size - 1,
        slideIndex: courseware.getIn(['ppt', 'slides']).size - 1
    }))
    return courseware;
}

/**
 * 删除环节
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const deleteTeachingLink = (courseware, action) => {
    const {includeChildren} = action;
    if (includeChildren) {
        return deleteTeachingLinkAndChildren(courseware, action);
    } else {
        return deleteTeachingLinkSelf(courseware, action);
    }
}

/**
 * 仅删除环节
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const deleteTeachingLinkSelf = (courseware, action) => {
    const {linkIndex} = action;
    courseware = courseware.withMutations(courseware => {
        const slidesOfLink = courseware.getIn(['ppt', 'teachingLinks', linkIndex, 'slides']);
        // 删除环节
        courseware.updateIn(['ppt', 'teachingLinks'], teachingLinks => teachingLinks.splice(linkIndex, 1));
        // 移动对应的slides
        if (linkIndex) {
            courseware.updateIn(['ppt', 'teachingLinks', linkIndex - 1, 'slides'], slides => slides.concat(slidesOfLink));
        } else {
            courseware.updateIn(['ppt', 'teachingLinks', linkIndex, 'slides'], slides => slidesOfLink.concat(slides));
        }
    });
    return courseware;
}

/**
 * 删除环节及卡片
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const deleteTeachingLinkAndChildren = (courseware, action) => {
    const {linkIndex} = action;
    const idxes = getLinkSlideIdxes(courseware, linkIndex);
    courseware = courseware.withMutations(courseware => {
        // 删除对应的slides
        courseware.updateIn(['ppt', 'slides'], slides => slides.splice(Math.min(...idxes), idxes.length));
        // 删除环节
        courseware.updateIn(['ppt', 'teachingLinks'], teachingLinks => teachingLinks.splice(linkIndex, 1));
    });
    // 处理current
    let current = courseware.get('current');
    const currentLinkIndex = courseware.getIn(['current', 'linkIndex']);
    current = current.withMutations(current => {
        if (currentLinkIndex === linkIndex) {
            // 取相邻：下一环节第一个卡片或上一环节最后一个卡片
            if (linkIndex < courseware.getIn(['ppt', 'teachingLinks']).size) {
                current.set('slideIndex', Math.min(...idxes));
            } else {
                current.update('linkIndex', linkIndex => --linkIndex);
                current.set('slideIndex', courseware.getIn(['ppt', 'slides']).size - 1);
            }
        } else if (currentLinkIndex > linkIndex) {
            current.update('linkIndex', linkIndex => --linkIndex);
            current.update('slideIndex', slideIndex => slideIndex - idxes.length);
        }
    });
    courseware = courseware.mergeIn(['current'], current);
    courseware = refreshIndex(courseware);
    courseware = reformExercise(courseware);
    return courseware;
}

/**
 *
 * @param {*Map} courseware 课件数据
 * @param {*Object} action
 */
const changeTeachingLinkTitle = (courseware, action) => {
    const {data} = action;
    const id = data.get('id');
    const index = courseware.getIn(['ppt', 'teachingLinks']).findIndex(value => value.get('id') === id);
    return courseware.setIn(['ppt', 'teachingLinks', index, 'title'], data.get('title'));
}

/**
 *
 * @param {*Map} courseware 课件数据
 * @param {*Object} action
 */
const copyTeachingLink = (courseware, action) => {
    const {data: index} = action;
    // 待复制的环节
    let link = courseware.getIn(['ppt', 'teachingLinks', index]);
    // 待复制的slide长度
    const slideSize = link.get('slides').size;

    // 复制slide
    let slidesCopy = Immutable.List();
    let slidesIdsCopy = Immutable.List();
    const slides = courseware.getIn(['ppt', 'slides']);
    // 带复制的起始slide
    const firstSlideIndex = slides.findIndex(slide => slide.get('id') === link.getIn(['slides', 0]));

    for (let i = 0; i < slideSize; i++) {
        let slide = slides.get(firstSlideIndex + i);
        // 更新卡片的id
        slide = updateId(slide);
        // 更新blocks的id
        slide = slide.update('blocks', blocks => updateId(blocks));

        slidesCopy = slidesCopy.push(slide);
        slidesIdsCopy = slidesIdsCopy.push(slide.get('id'));
    }

    // 新增复制的slides
    courseware = courseware.updateIn(['ppt', 'slides'], slides => slides.splice(firstSlideIndex + slideSize, 0, ...slidesCopy));

    // 更新link
    link = link.withMutations(link => {
        link
        .update(updateId)
        .set('slides', slidesIdsCopy)
    })

    // link加入teachingLink
    courseware = courseware.updateIn(['ppt', 'teachingLinks'], teachingLinks => teachingLinks.splice(index + 1, 0, link))

    courseware = refreshIndex(courseware);

    slidesCopy.forEach(slide => {
        // 添加可能有的习题
        slide.get('blocks').forEach(block => {
            if (block.get('isQuestion')) {
                courseware = handleAddQuestion(courseware, Immutable.Map({
                    blockId: block.get('id')
                }), Immutable.List().setSize(1))
            }
        })
    })

    return courseware;
}

export {
    exchangeLink,
    moveSlideToLink,
    addTeachingLink,
    deleteTeachingLink,
    changeTeachingLinkTitle,
    copyTeachingLink
}
