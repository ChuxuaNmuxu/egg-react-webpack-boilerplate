import {
    COURSEWARE_BLOCK_MOUSEDOWN,
    COURSEWARE_SLIDE_MOUSEMOVE,
    COURSEWARE_SLIDE_MOUSEUP,
    COURSEWARE_SLIDE_MOUSEDOWN,
    COURSEWARE_ADD_BLOCK,
    COURSEWARE_DELETE_BLOCK,
    COURSEWARE_BLOCK_FOCUSED,
    COURSEWARE_OPTIONBTN_CLICK,
    COURSEWARE_CROP_CANCEL,
    COURSEWARE_CROP_COMPLETE,
    COURSEWARE_HEAD_CHANGETITLE,
    COURSEWARE_LINK_EXCHANGE,
    COURSEWARE_LINK_ADD,
    COURSEWARE_LINK_DELETE,
    COURSEWARE_SLIDE_MOVE_TO_LINK,
    COURSEWARE_SLIDE_MOVE,
    COURSEWARE_SLIDE_ADD,
    COURSEWARE_SLIDE_DELETE,
    COURSEWARE_SLIDE_TO,
    COURSEWARE_SLIDE_REFRESH_THUMNAIL,
    COURSEWARE_EXERCISE_MERGE,
    COURSEWARE_EXERCISE_SPLIT,
    COURSEWARE_BLOCK_ACTIVATE,
    COURSEWARE_COPY_BLOCK,
    COURSEWARE_PASTE_BLOCK,
    COURSEWARE_ARROW_EVENT,
    COURSEWARE_EDIT_BLOCK,
    COURSEWARE_TABLE_QUIKE_OPTION,
    COURSEWARE_TABLE_RESIZE,
    COURSEWARE_QUESTION_SNAPSHOOT,
    COURSEWARE_QUESTION_REDRAW,
    COURSEWARE_SET_BLOCK_PROPS,
    COURSEWARE_ZINDEX_UP,
    COURSEWARE_ZINDEX_DOWN,
    COURSEWARE_TABLE_CHANGE_ROW,
    COURSEWARE_TABLE_CHANGE_COLUMN,
    COURSEWARE_SLIDE_ADD_BACKGROUND,
    COURSEWARE_SLIDE_REMOVE_BACKGROUND,
    COURSEWARE_SHAPE_CHANGE_TYPE,
    COURSEWARE_GROUP_ALIGN,
    COURSEWARE_BLOCK_CHANGE_IMAGE,
    COURSEWARE_TIMIMG_SAVEPPT,
    COURSEWARE_UNMOUNT_INITDATA,
    COURSEWARE_CHANGE_ANIMATION_EFFECT,
    COURSEWARE_CHANGE_SLIDE_ANIMATION_EFFECT,
    COURSEWARE_CHANGE_SLIDE_ANIMATION_SPEED,
    COURSEWARE_CHANGE_QUESTION_TYPE,
    COURSEWARE_CHANGE_SINGLE_ANSWER,
    COURSEWARE_CHANGE_QUESTION_OPTIONS,
    COURSEWARE_MATCH_OPTIONS,
    COURSEWARE_SAVE_TEXT_CONTENT,
    COURSEWARE_SAVE_TABLE_CONTENT,
    COURSEWARE_SELECT_BLOCKS,
    COURSEWARE_TEXT_RESIZE,
    COURSEWARE_SAVE_TABLE_HTML,
    COURSEWARE_CHANGE_SLIDE_INDEX,
    COURSEWARE_SAVE_QUESTION_CONTENT,
    COURSEWARE_SLIDE_ADD_BACKGROUNDCOLOR,
    COURSEWARE_SLIDE_REMOVE_BACKGROUNDCOLOR,
    COURSEWARE_SAVE_TABLE_CONTENT_AND_HTML,
    COURSEWARE_SELECT_ALL,
    COURSEWARE_EDITOR_ACTIVE,
    COURSEWARE_CHANGE_TEACHINGLINKING_TITLE,
    COURSEWARE_COPY_TEACHINGLINK,
    COURSEWARE_COPY_SLIDE,
    COURSEWARE_IMAGE_LOADED,
    COURSEWARE_CHANGE_SUBJECT_ANSWER,
    COURSEWARE_CHANGE_WRAP_BLOCK,
    COURSEWARE_CONFIRM_QUESTION_OVERNUMBER
 } from './actionTypes';
import { message } from 'antd';
import {Map} from 'immutable';
import api from '../utils/api';
import { ActionCreators } from 'redux-undo';
import config from '../../config';

export const clickBlock = (data) => {
    return {
        type: COURSEWARE_BLOCK_MOUSEDOWN,
        data
    }
}

export const mouseMoveOnSlide = (data) => {
    return {
        type: COURSEWARE_SLIDE_MOUSEMOVE,
        data
    }
}

export const mouseUpOnSlide = (data) => {
    return {
        type: COURSEWARE_SLIDE_MOUSEUP,
        data
    }
}

export const mousedownOnSlide = (data) => {
    return {
        type: COURSEWARE_SLIDE_MOUSEDOWN,
        data
    }
}

export const addBlock = (data) => {
    return {
        type: COURSEWARE_ADD_BLOCK,
        data
    }
}

export const clickOptionBtn = (data) => {
    return {
        type: COURSEWARE_OPTIONBTN_CLICK,
        data
    }
}

export const cancelCrop = (data) => {
    return {
        type: COURSEWARE_CROP_CANCEL,
        data
    }
}

export const complateCrop = (data) => {
    return {
        type: COURSEWARE_CROP_COMPLETE,
        data
    }
}

export const imagesLoaded = (data) => {
    return {
        type: COURSEWARE_IMAGE_LOADED,
        data
    }
}

export const deleteBlock = (data) => {
    return {
        type: COURSEWARE_DELETE_BLOCK,
        data
    }
}

export const copyBlock = (data) => {
    return {
        type: COURSEWARE_COPY_BLOCK,
        data
    }
}

export const pasteBlock = (data) => {
    return {
        type: COURSEWARE_PASTE_BLOCK,
        data
    }
}

export const blockFocused = (data) => {
    return {
        type: COURSEWARE_BLOCK_FOCUSED,
        data
    }
}

export const editBlock = (data) => {
    return {
        type: COURSEWARE_EDIT_BLOCK,
        data
    }
}

export const arrowEvent = (data) => {
    return {
        type: COURSEWARE_ARROW_EVENT,
        data
    }
}

export const tableResize = (data) => {
    return {
        type: COURSEWARE_TABLE_RESIZE,
        data
    }
}

export const handleSaveTableContentAndHTML = (data) => {
    return {
        type: COURSEWARE_SAVE_TABLE_CONTENT_AND_HTML,
        data
    }
}

export const textResize = (data) => {
    return {
        type: COURSEWARE_TEXT_RESIZE,
        data
    }
}

export const questionRedraw = (data) => {
    return {
        type: COURSEWARE_QUESTION_REDRAW,
        data
    }
}

export const setBlockProps = (data) => {
    return {
        type: COURSEWARE_SET_BLOCK_PROPS,
        data
    }
}

export const zIndexUp = (data) => {
    return {
        type: COURSEWARE_ZINDEX_UP,
        data
    }
}

export const zIndexDown = (data) => {
    return {
        type: COURSEWARE_ZINDEX_DOWN,
        data
    }
}

export const changeTableRow = (data) => {
    return {
        type: COURSEWARE_TABLE_CHANGE_ROW,
        data
    }
}

export const changeTableColumn = (data) => {
    return {
        type: COURSEWARE_TABLE_CHANGE_COLUMN,
        data
    }
}

export const changeShapeType = (data) => {
    return {
        type: COURSEWARE_SHAPE_CHANGE_TYPE,
        data
    }
}

export const groupAlign = (data) => {
    return {
        type: COURSEWARE_GROUP_ALIGN,
        data
    }
}

export const changeAnimationAffect = (data) => {
    return {
        type: COURSEWARE_CHANGE_ANIMATION_EFFECT,
        data
    }
}

export const changeQuestionType = (data) => {
    return {
        type: COURSEWARE_CHANGE_QUESTION_TYPE,
        data
    }
}

export const selectAnswer = (data) => {
    return {
        type: COURSEWARE_CHANGE_SINGLE_ANSWER,
        data
    }
}

export const changeSubjectAnswer = (data) => {
    return {
        type: COURSEWARE_CHANGE_SUBJECT_ANSWER,
        data
    }
}

// 更换图片block的图片
export const changeBlockImage = (data) => {
    return {
        type: COURSEWARE_BLOCK_CHANGE_IMAGE,
        data
    }
}

// 增加slide背景
export const slideAddBackground = (data) => {
    return {
        type: COURSEWARE_SLIDE_ADD_BACKGROUND,
        data
    }
}

export const slideRemoveBackground = (data) => {
    return {
        type: COURSEWARE_SLIDE_REMOVE_BACKGROUND,
        data
    }
}

// 增加slide背景色
export const slideAddBackgroundColor = (data) => {
    return {
        type: COURSEWARE_SLIDE_ADD_BACKGROUNDCOLOR,
        data
    }
}

export const slideRemoveBackgroundColor = (data) => {
    return {
        type: COURSEWARE_SLIDE_REMOVE_BACKGROUNDCOLOR,
        data
    }
}

// table的快捷操作
export const tableOption = (data) => {
    return {
        type: COURSEWARE_TABLE_QUIKE_OPTION,
        data
    }
}

export const questionSnapshoot = (data) => {
    return {
        type: COURSEWARE_QUESTION_SNAPSHOOT,
        data
    }
}

export const changeSlideAnimationEffect = (data) => {
    return {
        type: COURSEWARE_CHANGE_SLIDE_ANIMATION_EFFECT,
        data
    }
}

export const changeAnimationSpeed = (data) => {
    return {
        type: COURSEWARE_CHANGE_SLIDE_ANIMATION_SPEED,
        data
    }
}

export const changeQuestionOption = (data) => {
    return {
        type: COURSEWARE_CHANGE_QUESTION_OPTIONS,
        data
    }
}

export const saveTextContent = (data) => {
    return {
        type: COURSEWARE_SAVE_TEXT_CONTENT,
        data
    }
}

export const saveTableContent = (data) => {
    return {
        type: COURSEWARE_SAVE_TABLE_CONTENT,
        data
    }
}

export const changeSlideIndex = (data) => {
    return {
        type: COURSEWARE_CHANGE_SLIDE_INDEX,
        data
    }
}

export const saveQuestionContent = (data) => {
    return {
        type: COURSEWARE_SAVE_QUESTION_CONTENT,
        data
    }
}

export const selectAll = (data) => {
    return {
        type: COURSEWARE_SELECT_ALL,
        data
    }
}

export const editorActive = (data) => {
    return {
        type: COURSEWARE_EDITOR_ACTIVE,
        data
    }
}

export const changeWrapBlock = (data) => {
    return {
        type: COURSEWARE_CHANGE_WRAP_BLOCK,
        data
    }
}

// 保存表格的html
export const saveTableHtml = (data) => {
    return {
        type: COURSEWARE_SAVE_TABLE_HTML,
        data
    }
}

// 框选元素
export const selectBlocks = (data) => {
    return {
        type: COURSEWARE_SELECT_BLOCKS,
        data
    }
}

// 框选元素
export const confirmQuestionOvernumber = () => {
    return {
        type: COURSEWARE_CONFIRM_QUESTION_OVERNUMBER
    }
}

// 对应题选项匹配
export const matchOptions = (data) => {
    return {
        type: COURSEWARE_MATCH_OPTIONS,
        data
    }
}

// 改变课程名称
export const changeHeadTitle = (name, courseId) => {
    // console.log('title', name);
    return (dispatch, getState) => {
        // return api.get('http://rapapi.org/mockjsdata/14656/saveTitle', {}, true).then(res => {
        const params = {
            name,
            gradeIds: null,
            subjectIds: null,
            summary: null
        }
        return api.put(config.apiResolve('current', `/api/user/coursewares/${courseId}/info`), params, 'json').then(res => {
            console.log(res);
            if (res.code === 0) {
                dispatch({
                    type: COURSEWARE_HEAD_CHANGETITLE,
                    name
                });
            } else {
                message.error(res.message);
            }
            return res;
        });
    }
}

// 交换环节
export const exchangeLink = function (sourceIndex, targetIndex) {
    return {
        type: COURSEWARE_LINK_EXCHANGE,
        sourceIndex,
        targetIndex
    }
}

// 移动卡片到环节
export const moveSlideToLink = (sourceSlideProps, targetLinkIndex) => {
    return {
        type: COURSEWARE_SLIDE_MOVE_TO_LINK,
        sourceSlideProps,
        targetLinkIndex
    }
}

// 移动卡片
export const moveSlide = (options) => {
    return {
        type: COURSEWARE_SLIDE_MOVE,
        ...options
    }
}

// 更改环节标题
export const changeTeachingLinkTitle = (data) => {
    return {
        type: COURSEWARE_CHANGE_TEACHINGLINKING_TITLE,
        data
    }
}

// 更改环节标题
export const copyTeachingLink = (data) => {
    return {
        type: COURSEWARE_COPY_TEACHINGLINK,
        data
    }
}

// 添加环节
export const addTeachingLink = () => {
    return {
        type: COURSEWARE_LINK_ADD
    }
}

// 删除环节
export const deleteTeachingLink = (linkIndex, includeChildren = false) => {
    return {
        type: COURSEWARE_LINK_DELETE,
        linkIndex,
        includeChildren
    }
}

// 添加卡片
export const addSlide = () => {
    return {
        type: COURSEWARE_SLIDE_ADD
    }
}

// 删除卡片
export const deleteSlide = (slideId) => {
    return {
        type: COURSEWARE_SLIDE_DELETE,
        slideId
    }
}

 // 复制卡片
export const handleCopySlide = (id) => {
    return {
        type: COURSEWARE_COPY_SLIDE,
        id
    }
}

// 切换卡片
export const slideTo = function (slideId) {
    return {
        type: COURSEWARE_SLIDE_TO,
        slideId
    }
}

// 刷新卡片缩略图
export const refreshSlideThumnail = (slideId, canvas) => {
    return {
        type: COURSEWARE_SLIDE_REFRESH_THUMNAIL,
        slideId,
        canvas
    }
}

// 激活块元素
export const activateBlock = (blockId) => {
    return {
        type: COURSEWARE_BLOCK_ACTIVATE,
        blockId
    }
}

// 合并练习
export const mergeExercise = (sourceIndex, targetIndex) => {
    return {
        type: COURSEWARE_EXERCISE_MERGE,
        sourceIndex,
        targetIndex
    }
}

// 拆分练习
export const splitExercise = (exerciseIndex, questionIndex) => {
    return {
        type: COURSEWARE_EXERCISE_SPLIT,
        exerciseIndex,
        questionIndex
    }
}

// 实时保存  /api/user/coursewares/{id}/content
export const timingSavePPT = (ppt, courseId, coverId) => {
    return (dispatch, getState) => {
        // http://rapapi.org/mockjsdata/14656/realTimeSave
        // return api.get('http://rapapi.org/mockjsdata/14656/realTimeSave', {}, true).then(res => {
        const title = getState().courseware.present.get('title');
        const params = {
            ppt: Map.isMap(ppt) ? ppt.toJS() : ppt,
            title
        }
        coverId && (params['coverId'] = coverId)
        console.log(params);
        return api.put(config.apiResolve('current', `/api/user/coursewares/${courseId}`), params, 'json').then(res => {
            // console.log(res);
            // 目前没用到，留着以后再说
            if (res.code === 0) {
                dispatch({
                    type: COURSEWARE_TIMIMG_SAVEPPT,
                    ppt
                });
            } else {
                message.error(res.message);
            }
            return res;
        })
    }
}

// 离开时初始化redux
export const unmountInitState = () => {
    return (dispatch, getState) => {
        // 恢复成初始化数据格式 这个要在 ActionCreators.clearHistory 上面 或者在 undo 的 filter 里面添加也可
        dispatch({
            type: COURSEWARE_UNMOUNT_INITDATA
        });
        // 清空undo 里面的future 跟past
        dispatch(ActionCreators.clearHistory());
    }
}

/**
 * 批量生成新的上传参数
 * @param {*number} count 请求的参数组数
 */
export const getOssParamsBatch = (count = 1) => {
    return (dispatch, getState) => {
        const params = {count}
        return api.post(config.apiResolve('current', `/api/upload/oss-parameters/batch`), params);
    }
}
