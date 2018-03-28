import {fromJS, Map, List} from 'immutable';

import {
    createNewExercise,
    getMaxZindex,
    deleteBlock,
    deleteQuestion,
    updateBlocks,
    updatePickedBlocks,
    getTheBlock,
    refreshIndex,
    queryBlockById,
    limitQuestionAmount
} from './helper';
import {
    commonQuestion,
    commonBlockConfig
} from './config'
import {
    slideTo
} from './slide'
import {
    handleBlockMouseDown
} from './baseBlock'
import uuid from 'uuid';
import {GROUP_QUESTION_PADDING} from '../../view/courseware/config/constant';

/**
 * 将普通元素转换成习题
 * @param {*object} courseware
 * @param {*object} data
 * @param {*object} blocks 可选参数，指定要转成习题的blocks
 */
const handleAddQuestion = (courseware, data, blocks) => {
    blocks = blocks || courseware.getIn(['current', 'blocks']);
    if (blocks.size > 1) { // 多个blocks转换成习题
        return transfromBlocksToQuestion(courseware);
    } else { // 单个block转换成习题
        courseware = addQuestionToExercise(courseware, data); // 在练习中添加题目
        return updatePickedBlocks(courseware, () => true, ['isQuestion'], data); // 将选中元素的isQuestion属性置为true
    }
}

/**
 * 将习题转换成普通元素
 * @param {*object} courseware
 * @param {*object} data
 */
const handleClearQuestion = (courseware, data) => {
    const type = getTheBlock(courseware, data).get('type');
    if (type === 'group') {
        return transfromQuestionToBlocks(courseware, List([data]));
    } else {
        courseware = deleteQuestion(courseware, data.get('blockId'));
        return updatePickedBlocks(courseware, () => false, ['isQuestion'])
    }
}

// 将多个block转换成一道习题
const transfromBlocksToQuestion = (courseware) => {
    let resultDelete = deleteBlock(courseware);
    let childBlocks = resultDelete.get('blocksDel'); // 删除被选中的元素，将被放到一个习题元素中
    courseware = resultDelete.get('courseware');
    const groupProps = calcGroupStyle(childBlocks); // 计算习题框的位置，大小

    // 习题框尺寸加一个padding
    const left = groupProps.get('left') - GROUP_QUESTION_PADDING;
    const top = groupProps.get('top') - GROUP_QUESTION_PADDING;
    const width = groupProps.get('width') + GROUP_QUESTION_PADDING * 2;
    const height = groupProps.get('height') + GROUP_QUESTION_PADDING * 2;

    childBlocks = childBlocks.map(block => { // 习题相对于页面定位改为相对于组合习题外框定位
        return block.withMutations(block => {
            block
            .updateIn(['props', 'position', 'left'], value => value - left)
            .updateIn(['props', 'position', 'top'], value => value - top)
        })
    })

    const blockId = `block-${uuid.v4()}`
    let zIndexMax = getMaxZindex(courseware);
    courseware = updateBlocks(courseware, blocks => { // 将组合习题push到blocks数组中
        const questionBlock = Map().withMutations(map => {
            map
            .set('id', blockId)
            .set('type', 'group')
            .set('isQuestion', true)
            .set('members', childBlocks)
            .setIn(['props', 'position', 'left'], left)
            .setIn(['props', 'position', 'top'], top)
            .setIn(['props', 'size', 'width'], width)
            .setIn(['props', 'size', 'height'], height)
            .setIn(['props', 'zIndex'], ++zIndexMax)
        })
        const block = fromJS(commonBlockConfig).mergeDeep(questionBlock);
        return blocks.push(block);
    }).withMutations(courseware => {
        courseware
        .updateIn(['current', 'zIndexs'], zIndexs => zIndexs.push(zIndexMax)) // 更新current中的zIndexs和groupCreating状态
        // .setIn(['current', 'groupCreating'], true)
        .setIn(['current', 'blocks'], List())
    })

    courseware = refreshIndex(courseware, 'blocks'); // 更新indexs

    courseware = handleBlockMouseDown(courseware, { // 组合习题生成后默认为选中状态
        data: Map({
            index: updateBlocks(courseware).size - 1,
            blockId: blockId,
            newProperty: Map({})
        })
    })

    courseware = addQuestionToExercise(courseware, Map({ // 将生成的习题放到练习中
        blockId: blockId
    }))

    return courseware
}

// 计算group框/习题框的位置及尺寸
const calcGroupStyle = (groupBlocks) => {
    let props = groupBlocks.map((block) => {
        // const {position, size, rotation} = block.props;
        // const {left, top} = position;
        // const {width, height} = size;
        const rotation = block.getIn(['props', 'rotation']);
        const left = block.getIn(['props', 'position', 'left']);
        const top = block.getIn(['props', 'position', 'top']);
        const width = block.getIn(['props', 'size', 'width']);
        const height = block.getIn(['props', 'size', 'height']);
        return {
            left,
            top,
            width,
            height,
            rotation,
            right: left + width,
            bottom: top + height
        }
    })
    let limit = props.get(0);
    // for (let prop of props) {
    //     limit.left = Math.min(limit.left, prop.left);
    //     limit.top = Math.min(limit.top, prop.top);
    //     limit.right = Math.max(limit.right, prop.right);
    //     limit.bottom = Math.max(limit.bottom, prop.bottom);
    // }

    props.forEach(prop => {
        limit.left = Math.min(limit.left, prop.left);
        limit.top = Math.min(limit.top, prop.top);
        limit.right = Math.max(limit.right, prop.right);
        limit.bottom = Math.max(limit.bottom, prop.bottom);
    })

    const left = limit.left;
    const right = limit.right;
    const top = limit.top;
    const bottom = limit.bottom;
    const width = limit.right - limit.left;
    const height = limit.bottom - limit.top;
    const center = left + 0.5 * width;
    const middle = top + 0.5 * height;

    return Map({
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        width: width,
        height: height,
        center: center,
        middle: middle
    })
}

// 将习题转换成普通元素
const transfromQuestionToBlocks = (courseware, blocksForDel) => {
    // const question = deleteBlock(fromJS(courseware), fromJS(blocksForDel)).get('blocksDel').toJS();
    const deleteObj = deleteBlock(courseware, blocksForDel);
    const question = deleteObj.get('blocksDel');
    courseware = deleteObj.get('courseware');

    let members = question.getIn([0, 'members']);
    const left = question.getIn([0, 'props', 'position', 'left']);
    const top = question.getIn([0, 'props', 'position', 'top']);
    let zIndexs = List();

    let zIndexMax = getMaxZindex(courseware);
    members = members.map(block => { // 习题相对于组合习题外框定位改为相对于页面定位
        zIndexs = zIndexs.push(++zIndexMax);
        return block.withMutations(block => {
            block
            .updateIn(['props', 'position', 'left'], value => value + left)
            .updateIn(['props', 'position', 'top'], value => value + top)
            .updateIn(['props', 'zIndex'], () => zIndexMax)
        })
    })
    courseware = updateBlocks(courseware, blocks => { // 将membes合入blocks数组
        return blocks.concat(members)
    })
    courseware = courseware.updateIn(['current', 'zIndexs'], value => value.concat(zIndexs)) // 更新zIdexs数组
    courseware = refreshIndex(courseware, 'blocks');

    return courseware;
}

// 根据blockId找所属练习
const getExerciseByBlockId = (courseware, blockId) => {
    const blocks = courseware.getIn(['index', 'blocks']);
    const slideIndex = blocks.get(blockId);
    return courseware.getIn(['ppt', 'exercises']).find(exercise => {
        const slides = exercise.get('questions').map(question => blocks.get(question.get('blockId')));
        if (slides.min() <= slideIndex && slideIndex <= slides.max()) {
            return true;
        }
        return false;
    });
}

/**
 * 清理废弃题目
 * @param {*} courseware 课件数据
 */
const clearAbandonQuestions = (courseware) => {
    let exercises = courseware.getIn(['ppt', 'exercises'])
    const blockIndex = courseware.getIn(['index', 'blocks']);
    exercises = exercises && exercises.map(exercise => {
        return exercise.update(
            'questions',
            questions => questions.filter(question => blockIndex.has(question.get('blockId')))
        );
    });
    exercises = exercises && exercises.filter(exercise => exercise.get('questions').size);
    return courseware.setIn(['ppt', 'exercises'], exercises);
}

/**
 * 处理交叉练习
 * @param {*} courseware 课件数据
 */
const dealCrossExercises = (courseware) => {
    const blocks = courseware.getIn(['index', 'blocks']);
    const exercises = courseware.getIn(['ppt', 'exercises']);
    let newExercises = List();
    exercises.forEach((exercise, exerciseIndex) => {
        const questions = exercise.get('questions');
        if (questions.size < 2) return;
        const slides = questions.flatMap(question => [blocks.get(question.get('blockId'))]).toSet().toList();
        const min = slides.min();
        const max = slides.max();
        if (max - min + 1 === slides.size) return;
        const fullSlides = List().withMutations(fullSlides => {
            for (let i = min; i <= max; i++) fullSlides.push(i);
        })
        const vacancy = fullSlides.filterNot(i => slides.indexOf(i) > -1);
        vacancy.forEach((slideIndex) => {
            if (!slideHasQuestion(courseware, slideIndex)) return;
            // 抽取大于slideIndex的
            const lastExercise = newExercises.last();
            const tmpQuestions = (lastExercise || exercise).get('questions');
            const filter = question => blocks.get(question.get('blockId')) > slideIndex;
            // 抽取生成新的
            const splitedQuestions = tmpQuestions.filter(filter);
            const newExercise = createNewExercise();
            newExercises = newExercises.push(newExercise.set('questions', splitedQuestions));
            // 修改旧的
            const restQuestions = tmpQuestions.filterNot(filter);
            if (lastExercise) {
                newExercises = newExercises.setIn([newExercises.size - 1, 'questions'], restQuestions);
            } else {
                courseware = courseware.setIn(['ppt', 'exercises', exerciseIndex, 'questions'], restQuestions);
            }
        });
    });
    return courseware.updateIn(['ppt', 'exercises'], exercises => exercises.concat(newExercises));
}

const slideHasQuestion = (courseware, slideIndex) => {
    const blocks = courseware.getIn(['index', 'blocks']);
    return courseware.getIn(['ppt', 'exercises'])
        .find(
            exercise => exercise.get('questions').find(
                question => blocks.get(question.get('blockId')) === slideIndex
            )
        );
}

/**
 * 重排练习
 * @param {*} courseware 课件数据
 */
const reformExercise = (courseware) => {
    // 清理废弃练习
    courseware = clearAbandonQuestions(courseware);
    // 处理交叉练习
    courseware = dealCrossExercises(courseware);
    const blocks = courseware.getIn(['index', 'blocks']);
    let exercises = courseware.getIn(['ppt', 'exercises']);
    // 练习排序
    exercises = exercises.sortBy(item =>
        item.get('questions').reduce((min, value) => {
            const slideIndex = blocks.get(value.get('blockId'));
            return min > slideIndex ? slideIndex : min
        }, Number.MAX_VALUE)
    );
    // 题目排序
    exercises = exercises.map(
        item => item.set(
            'questions',
            item.get('questions').sortBy(question => blocks.get(question.get('blockId')))
        )
    );
    return courseware.setIn(['ppt', 'exercises'], exercises);
}

/**
 * 添加题目到对应的练习
 * @param {*Map} courseware 课件数据
 * @param {*Map} data action中的数据信息
 */
const addQuestionToExercise = (courseware, data) => {
    courseware = refreshIndex(courseware, 'blocks');
    const question = commonQuestion.withMutations(question => {
        question
        .merge(data)
        .merge(Map({
            type: 'single'
        }))
    })
    const questionId = question.get('blockId');
    let exercise = getExerciseByBlockId(courseware, questionId);
    if (!exercise) {
        exercise = createNewExercise();
    }
    exercise = exercise.update('questions', questions => questions.push(question));

    const exerciseIndex = courseware.getIn(['ppt', 'exercises']).findIndex(item => item.get('id') === exercise.get('id'));
    courseware = courseware.updateIn(
        ['ppt', 'exercises'],
        exercises => exerciseIndex > -1 ? exercises.set(exerciseIndex, exercise) : exercises.push(exercise)
    );

    // 习题排序
    courseware = sortQuestions(courseware, questionId);

    return reformExercise(courseware);
}

/**
 * 习题排序，优先按动画，其次按位置
 * @param {*Map} courseware 课件数据
 * @param {*string} questionId 习题id
 */
const sortQuestions = (courseware, questionId) => {
    // question所在的exercise的索引
    let exerciseIndex = courseware.getIn(['ppt', 'exercises']).findIndex(value => value.get('questions').some(question => question.get('blockId') === questionId));

    courseware = courseware.updateIn(['ppt', 'exercises', exerciseIndex], exercise => {
        return exercise.update('questions', questions => {
            return questions.sortBy(value => value.get('blockId'), (a, b) => { // 排列优先级：卡片索引 -> 点击动画索引 -> top -> left
                // 卡片索引
                const slideIndexA = courseware.getIn(['index', 'blocks', a]);
                const slideIndexB = courseware.getIn(['index', 'blocks', b]);

                const blockA = queryBlockById(courseware, a);
                const blockB = queryBlockById(courseware, b);

                // 点击动画的次序
                const aIndex = blockA.getIn(['props', 'animation', 'effect']) === '' ? -1 : blockA.getIn(['props', 'animation', 'index']);
                const bIndex = blockB.getIn(['props', 'animation', 'effect']) === '' ? -1 : blockB.getIn(['props', 'animation', 'index']);

                if (slideIndexA !== slideIndexB) {
                    return slideIndexA - slideIndexB
                } else if ((aIndex !== -1 || bIndex !== -1) && aIndex !== bIndex) {
                    return aIndex - bIndex
                } else {
                    const aTop = blockA.getIn(['props', 'position', 'top']);
                    const aLeft = blockA.getIn(['props', 'position', 'left']);
                    const bTop = blockB.getIn(['props', 'position', 'top']);
                    const bLeft = blockB.getIn(['props', 'position', 'left']);

                    if (aTop !== bTop) {
                        return aTop - bTop
                    } else {
                        return aLeft - bLeft
                    }
                }
            })
        })
    })

    return courseware;
}

/**
 * 合并练习
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const mergeExercise = (courseware, action) => limitQuestionAmount({
    slideIndexInAction: 'targetIndex',
    type: 'mergeExercise'
})(function (courseware, action) {
    const {sourceIndex, targetIndex} = action;
    let exercises = courseware.getIn(['ppt', 'exercises']);
    exercises = exercises.updateIn([targetIndex, 'questions'], questions => questions.concat(exercises.getIn([sourceIndex, 'questions'])));
    return courseware.setIn(['ppt', 'exercises'], exercises.splice(sourceIndex, 1));
})(courseware, action)

/**
 * 拆分练习
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const splitExercise = function (courseware, action) {
    const {exerciseIndex, questionIndex} = action;
    let exercise = createNewExercise();
    return courseware.updateIn(['ppt', 'exercises'], exercises => {
        exercise = exercise.set('questions', exercises.getIn([exerciseIndex, 'questions']).splice(0, questionIndex));
        exercises = exercises.updateIn([exerciseIndex, 'questions'], questions => questions.splice(questionIndex));
        return exercises.splice(exerciseIndex + 1, 0, exercise);
    });
}

/**
 * 激活块元素
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const activateBlock = function (courseware, action) {
    action = fromJS(action);
    const blockId = action.get('blockId');
    const blocks = courseware.getIn(['index', 'blocks']);
    const slides = courseware.getIn(['ppt', 'slides']);
    action = action.set('slideId', slides.getIn([blocks.get(blockId), 'id']));
    courseware = slideTo(courseware, action);

    // 激活状态
    const index = updateBlocks(courseware).findIndex(block => block.get('id') === blockId);
    courseware = handleBlockMouseDown(courseware, {
        data: Map({
            index: index,
            blockId: blockId,
            newProperty: Map({})
        })
    })
    return courseware;
}

/**
 * 将习题截图保存到练习中
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const addSnapshootToExercise = (courseware, action) => {
    const {data} = action;
    const blockId = data.get('blockId');
    const snapshoot = data.get('snapshoot');

    const exerciseIndex = courseware.getIn(['ppt', 'exercises']).findIndex(exercise => exercise.get('questions').some(question => question.get('blockId') === blockId));
    return courseware.updateIn(['ppt', 'exercises', exerciseIndex], exercise => {
        return exercise.update('questions', questions => questions.map(question => question.get('blockId') === blockId ? question.set('content', snapshoot) : question));
    })
}

export {
    handleAddQuestion,
    handleClearQuestion,
    reformExercise,
    activateBlock,
    mergeExercise,
    splitExercise,
    calcGroupStyle,
    sortQuestions,
    getExerciseByBlockId,
    addQuestionToExercise,
    addSnapshootToExercise
}
