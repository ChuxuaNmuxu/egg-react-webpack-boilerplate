/**
 * 组合元素处理逻辑
 */
import {
    updateQuestion,
    updateBlocks,
    updatePickedBlocks,
    isGroupIndex
} from './helper';
import {
    calcGroupStyle
} from './exercise'
import {List, Map} from 'immutable';
import {GROUP_QUESTION_PADDING} from '../../view/courseware/config/constant';
import {questionDefault} from './config'
/**
 * 更改习题答案，类型
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const changeQuestionType = (courseware, action) => {
    let {data} = action;
    const type = data.get('type');

    data = data.merge(questionDefault.get(type));

    return updateQuestion(courseware, question => {
        return question.merge(data)
    })
}

/**
 * 主观题答案
 * @param {*object} courseware 课件数据
 * @param {*object} action
 */
const changeSubjectAnswer = (courseware, action) => {
    const {data} = action;
    const index = data.get('index');
    const value = data.get('value');

    return updateQuestion(courseware, question => question.setIn(['estimateScore', index], value));
}

/**
 * 更改习题选项
 * @param {*object} courseware 课件数据
 * @param {*object} action
 */
const changeQuestionOptions = (courseware, action) => {
    const {data} = action;
    const option = data.get('option');
    const options = data.get('options');

    const question = updateQuestion(courseware);
    const questionOptions = question.get('options');
    const questionType = question.get('type');
    let prop = Map();

    if (option === 'add' && questionOptions <= 5) {
        prop = prop.set('options', questionOptions + 1)
    } else if (option === 'delete' && questionOptions >= 3) {
        prop = questionDefault.get(questionType).merge(Map({
            options: questionOptions - 1
        }))
    } else if (options) {
        if (questionType === 'match' && options < questionOptions) {
            prop = prop.set('answer', List().setSize(6));
        }
        prop = prop.set('options', options)
    }

    if (questionType === 'subjective' && options) {
        courseware = updateQuestion(courseware, question => {
            return question.update('estimateScore', score => {
                return score.setSize(options).map(value => value || 0)
            })
        })
    }

    return updateQuestion(courseware, question => question.merge(prop));
}

/**
 * 更改单选题答案
 * @param {*object} courseware
 * @param {*object} action
 */
const mergeToQuestion = (courseware, action) => {
    // action = fromJS(action);
    const {data} = action;
    courseware = updateQuestion(courseware, question => question.merge(data));
    if (data.get('questionType') === 'multiple') {
        courseware = updateQuestion(courseware, question => question.update('answer', answer => answer.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))));
    }
    return courseware;
}

/**
 * 对应题匹配答案
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const matchOptions = (courseware, action) => {
    // action = fromJS(action);
    const {data} = action;

    const number = data.get('number');
    const letter = data.get('letter');

    if (number < 0) {
        return courseware;
    }

    courseware = updateQuestion(courseware, question => {
        const index = question.get('answer').findIndex(value => value === letter);
        return question.update('answer', answer => {
            return answer.withMutations(question => {
                question
                .set(index, null)
                .set(number, letter)
            })
        })
    })
    return courseware;
}

/**
 * 习题内容改变后习题重新截图
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const questionRedraw = (courseware, action) => {
    const {data} = action;
    const {snapshoot, blockId} = data;
    const {exercises} = courseware.ppt;
    for (let index in exercises) {
        const {questions} = exercises[index];
        for (let q of questions) {
            if (q.blockId === blockId) {
                q.content = snapshoot
            }
        }
    }
    return courseware;
}

/**
 * 在内部block改变后改变习题外框的位置与大小
 * @param {*object} courseware 课件数据
 * @param {*number} groupIndex 组合习题的索引
 */
const changeGroupStyle = (courseware, groupIndex) => {
    groupIndex = isGroupIndex(groupIndex) ? groupIndex : courseware.getIn(['current', 'blocks', 0, 'groupIndex']);
    const blockEntity = updateBlocks(courseware).get(groupIndex); // 被选中block的数据

    const left = blockEntity.getIn(['props', 'position', 'left']);
    const top = blockEntity.getIn(['props', 'position', 'top']);
    let members = blockEntity.get('members');

    /**
     * 将习题框内的block的position还原为相对于slide
     */
    members = members.map(block => {
        return block.withMutations(block => {
            block
            .updateIn(['props', 'position', 'left'], value => left + value)
            .updateIn(['props', 'position', 'top'], value => top + value)
        })
    })

    // 组合框的位置大小
    const groupProps = calcGroupStyle(members);
    const groupLeft = groupProps.get('left');
    const groupTop = groupProps.get('top');

    /**
     * 更新组合习题外边框
     */
    courseware = updatePickedBlocks(courseware, block => {
        return block.withMutations(block => {
            block
            .setIn(['props', 'position', 'left'], groupLeft - GROUP_QUESTION_PADDING)
            .setIn(['props', 'position', 'top'], groupTop - GROUP_QUESTION_PADDING)
            .setIn(['props', 'size', 'width'], groupProps.get('width') + GROUP_QUESTION_PADDING * 2)
            .setIn(['props', 'size', 'height'], groupProps.get('height') + GROUP_QUESTION_PADDING * 2)
            .update('members', members => { // 习题框内的block的position相对于习题框的位置
                return members.map(member => {
                    return member.withMutations(member => {
                        member
                        .updateIn(['props', 'position', 'left'], value => value + left - groupLeft + GROUP_QUESTION_PADDING)
                        .updateIn(['props', 'position', 'top'], value => value + top - groupTop + GROUP_QUESTION_PADDING)
                    })
                })
            })
        })
    }, null, Map({
        index: groupIndex
    }))

    return courseware;
}

/**
 * 保存习题的内容为HTML格式
 * @param {*Map} courseware 课件数据
 * @param {*Map} action action数据
 */
const saveQuestionContent = (courseware, action) => {
    const {data} = action;
    const blockId = data.get('blockId');
    const content = data.get('content');
    return updateQuestion(courseware, (question) => question.set('content', content), blockId)
}

/**
 * 确认练习中习题数量超过限制
 * @param {*Map} courseware 课件数据
 * @param {*Map} action action数据
 */
const confirmQuestionOvernumber = (courseware, action) => {
    return courseware.setIn(['current', 'questionOverNumber'], '');
}

export {
    changeQuestionType,
    mergeToQuestion,
    changeQuestionOptions,
    matchOptions,
    questionRedraw,
    changeGroupStyle,
    saveQuestionContent,
    changeSubjectAnswer,
    confirmQuestionOvernumber
}
