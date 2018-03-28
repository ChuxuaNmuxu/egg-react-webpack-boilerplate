import {
    keys
} from 'lodash'
import undoable from 'redux-undo';
import Immutable from 'immutable';

import initialState from '../initialState';
import {
    handleBlockMouseDown,
    handleAddBlock,
    handleDeleteBlock,
    handleCopyBlock,
    handlePasteBlock,
    // blockEditor,
    handleBlockQuickOption,
    zIndexUp,
    zIndexDown,
    setBlockProps,
    changeAnimationEffect,
    handleChangeWrapBlock
} from './baseBlock'
import {
    moveSlide,
    addSlide,
    handleSlideMouseUp,
    handleSlideMouseDown,
    changeSlideAnimation,
    addSlideBackground,
    removeSlideBackground,
    addSlideBackgroundColor,
    removeSlideBackgroundColor,
    deleteSlide,
    slideTo,
    refreshSlideThumnail,
    handleChangeSlideIndex,
    handleSelectAll,
    handleCopySlide
} from './slide'
import {
    activateBlock,
    mergeExercise,
    splitExercise,
    addSnapshootToExercise
} from './exercise'
import {
    handleTalbeQuickOption,
    changeTableRanks,
    // saveTableContent,
    handleTableResize,
    // handleSaveTableHtml,
    handleSaveTableContentAndHTML
} from './tableBlock'
import {
    handleGetData,
    handleChangeTitle,
    unmountInitState
} from './global'
import {
    handleCancleCrop,
    handleCompleteCrop,
    changeBlockImage,
    handleImageLoaded
} from './imageBlock'
import {
    handleArrowEvent
} from './keyboard'
import {
    changeQuestionType,
    mergeToQuestion,
    changeQuestionOptions,
    matchOptions,
    questionRedraw,
    saveQuestionContent,
    changeSubjectAnswer,
    confirmQuestionOvernumber
} from './questionBlock'
import {
    changeShapeType
} from './shapeBlock'
import {
    exchangeLink,
    moveSlideToLink,
    addTeachingLink,
    deleteTeachingLink,
    changeTeachingLinkTitle,
    copyTeachingLink
} from './teachingLink'
import {
    saveTextContent,
    handleTextResize,
    handleEditorActive
} from './textBlock'
import {
    groupAlign,
    selectBlocks
} from './groupBlock'

// reducer生成函数，减少样板代码
const createReducer = (initialState, handlers) => {
    return (state = Immutable.fromJS(initialState.courseware), action) => {
        if (handlers.hasOwnProperty(action.type)) {
            state = handlers[action.type](state, action);
            // if (Immutable.Map.isMap(state)) {
            //     state = state.toJS();
            // }
        }
        return state;
    }
}

const courseware = {
    /**
     * 卡片
     */
    // COURSEWARE_SLIDE_MOUSEMOVE: handleSlideMouseMove, // slide的鼠标移动处理
    COURSEWARE_SLIDE_MOUSEUP: handleSlideMouseUp, // slide的鼠标mouseUp处理
    COURSEWARE_SLIDE_MOUSEDOWN: handleSlideMouseDown, // slide的鼠标mouseDown处理
    COURSEWARE_SLIDE_ADD_BACKGROUND: addSlideBackground, // 增加slide背景图
    COURSEWARE_SLIDE_REMOVE_BACKGROUND: removeSlideBackground, // 删除slide背景图
    COURSEWARE_SLIDE_ADD_BACKGROUNDCOLOR: addSlideBackgroundColor, // 增加slide背景颜色
    COURSEWARE_SLIDE_REMOVE_BACKGROUNDCOLOR: removeSlideBackgroundColor, // 删除slide背景颜色
    COURSEWARE_CHANGE_SLIDE_ANIMATION_EFFECT: changeSlideAnimation, // 更改slide切换动画类型
    COURSEWARE_CHANGE_SLIDE_ANIMATION_SPEED: changeSlideAnimation, // 更改slide切换动画速度
    COURSEWARE_CHANGE_SLIDE_INDEX: handleChangeSlideIndex, // 点击翻页控制器时改变slideIndex
    COURSEWARE_SELECT_ALL: handleSelectAll,
    COURSEWARE_COPY_SLIDE: handleCopySlide, // 复制卡片

    /**
     * 块状元素通用的操作
     */
    COURSEWARE_BLOCK_MOUSEDOWN: handleBlockMouseDown, // 块元素点击
    COURSEWARE_ADD_BLOCK: handleAddBlock, // 增加块状元素
    COURSEWARE_DELETE_BLOCK: handleDeleteBlock, // 删除块状元素
    COURSEWARE_COPY_BLOCK: handleCopyBlock, // 复制块状元素
    COURSEWARE_PASTE_BLOCK: handlePasteBlock, // 粘贴块状元素
    // COURSEWARE_EDIT_BLOCK: blockEditor, // 切换block为可编辑状态
    COURSEWARE_OPTIONBTN_CLICK: handleBlockQuickOption, // block的快捷按钮操作
    COURSEWARE_SET_BLOCK_PROPS: setBlockProps, // 更改block的属性
    COURSEWARE_ZINDEX_DOWN: zIndexDown, // 层级下一层
    COURSEWARE_ZINDEX_UP: zIndexUp, // 层级上一层
    COURSEWARE_CHANGE_ANIMATION_EFFECT: changeAnimationEffect, // 更改动画类型
    COURSEWARE_CHANGE_WRAP_BLOCK: handleChangeWrapBlock, // 更改元素外边框的属性

    /**
     * 文本框
     */
    COURSEWARE_SAVE_TEXT_CONTENT: saveTextContent, // 保存文本编辑器的内容
    COURSEWARE_TEXT_RESIZE: handleTextResize,
    COURSEWARE_EDITOR_ACTIVE: handleEditorActive, // 文本编辑器被激活

    /**
     * 表格
     */
    COURSEWARE_TABLE_QUIKE_OPTION: handleTalbeQuickOption, // table的快捷操作
    COURSEWARE_TABLE_CHANGE_ROW: changeTableRanks,
    COURSEWARE_TABLE_CHANGE_COLUMN: changeTableRanks,
    // COURSEWARE_SAVE_TABLE_CONTENT: saveTableContent, // 保存表格的内容
    COURSEWARE_TABLE_RESIZE: handleTableResize, // 监听table的高度变化
    // COURSEWARE_SAVE_TABLE_HTML: handleSaveTableHtml, // 保存table的html格式
    COURSEWARE_SAVE_TABLE_CONTENT_AND_HTML: handleSaveTableContentAndHTML, // 保存table的html, td的内容

    /**
     * 形状
     */
    COURSEWARE_SHAPE_CHANGE_TYPE: changeShapeType, // 更改形状block的形状类型

    /**
     * 图片
     */
    COURSEWARE_CROP_CANCEL: handleCancleCrop, // 取消图片分割
    COURSEWARE_CROP_COMPLETE: handleCompleteCrop, // 完成图片分割
    COURSEWARE_BLOCK_CHANGE_IMAGE: changeBlockImage, // 更改图片
    COURSEWARE_IMAGE_LOADED: handleImageLoaded, // 正在分割图片

    /**
     * 块状元素的组合
     */
    COURSEWARE_GROUP_ALIGN: groupAlign, // 组合对齐
    COURSEWARE_SELECT_BLOCKS: selectBlocks, // 多选框选元素

    /**
     * 键盘快捷键
     */
    COURSEWARE_ARROW_EVENT: handleArrowEvent, // 键盘上下左右键

    /**
     * 卡片导航
     */
    COURSEWARE_SLIDE_ADD: addSlide, // 添加卡片
    COURSEWARE_SLIDE_DELETE: deleteSlide, // 删除卡片
    COURSEWARE_SLIDE_MOVE: moveSlide, // 移动卡片
    COURSEWARE_SLIDE_TO: slideTo, // 切换卡片
    COURSEWARE_SLIDE_REFRESH_THUMNAIL: refreshSlideThumnail, // 刷新卡片缩略图

    /**
     * 教学环节
     */
    COURSEWARE_LINK_EXCHANGE: exchangeLink, // 交换环节
    COURSEWARE_SLIDE_MOVE_TO_LINK: moveSlideToLink, // 移动卡片到环节
    COURSEWARE_LINK_ADD: addTeachingLink, // 添加环节
    COURSEWARE_LINK_DELETE: deleteTeachingLink, // 删除环节
    COURSEWARE_CHANGE_TEACHINGLINKING_TITLE: changeTeachingLinkTitle, // 更改环节标题
    COURSEWARE_COPY_TEACHINGLINK: copyTeachingLink, // 复制教学环节

    /**
     * 练习
     */
    COURSEWARE_BLOCK_ACTIVATE: activateBlock, // 激活块元素
    COURSEWARE_EXERCISE_MERGE: mergeExercise, // 合并练习
    COURSEWARE_EXERCISE_SPLIT: splitExercise, // 拆分练习
    COURSEWARE_QUESTION_REDRAW: questionRedraw, // 习题内容改变时重新截图
    COURSEWARE_QUESTION_SNAPSHOOT: addSnapshootToExercise, // 习题截图后添加到exercise

    /**
     * 习题
     */
    COURSEWARE_CHANGE_QUESTION_TYPE: changeQuestionType, // 更改习题类型
    COURSEWARE_CHANGE_SINGLE_ANSWER: mergeToQuestion, // 更改单选题答案
    COURSEWARE_CHANGE_QUESTION_OPTIONS: changeQuestionOptions, // 更改习题选项
    COURSEWARE_MATCH_OPTIONS: matchOptions, // 对应题选项匹配
    COURSEWARE_SAVE_QUESTION_CONTENT: saveQuestionContent, // 保存习题的内容为HTML格式
    COURSEWARE_CHANGE_SUBJECT_ANSWER: changeSubjectAnswer, // 主观题答案
    COURSEWARE_CONFIRM_QUESTION_OVERNUMBER: confirmQuestionOvernumber, // 确认练习中习题数量超过限制

    /**
     * 一些全局操作
     */
    COURSEWARE_HEAD_CHANGETITLE: handleChangeTitle, // 改变课程名称
    // COURSEWARE_TIMIMG_SAVEPPT: undefined, // 自动保存的，以后需要再使用
    COURSEWARE_UNMOUNT_INITDATA: unmountInitState, // 离开时 初始化数据
    COURSE_EDITOR_GET_DATA: handleGetData // 获取数据
}
// console.log(keys(courseware));
const excludeActions = [
    'COURSEWARE_BLOCK_MOUSEDOWN',
    'COURSEWARE_SLIDE_MOUSEMOVE',
    // 'COURSEWARE_SLIDE_MOUSEUP',
    'COURSEWARE_SLIDE_MOUSEDOWN',
    // 自动保存的不能存进 undo
    'COURSEWARE_TIMIMG_SAVEPPT',
    // 初次进来这个也不需要!(防止刷新没数据的操作)
    // 'COURSE_EDITOR_GET_DATA',
    // 从金写的实时保存
    'COURSEWARE_SLIDE_REFRESH_THUMNAIL',
    'COURSEWARE_TEXT_RESIZE'
];
const includeActions = keys(courseware);

export default undoable(createReducer(initialState, courseware), {
    limit: 50,
    filter: (action, currentState, previousHistory) => {
        return includeActions.indexOf(action.type) > -1 && excludeActions.indexOf(action.type) < 0;
    }
});
