import {Map, fromJS} from 'immutable';

import {EMPTY_SLIDE_THUMNAIL, FONT_COLOR} from '../../view/courseware/config/constant';

// 空slide配置
const emptySlide = { // 卡片or页面
    id: 'slide-uuid', // 唯一：uuid
    thumnail: EMPTY_SLIDE_THUMNAIL,
    props: {
        background: { // 背景
            image: '', // 图片
            color: '#fff' // 颜色
        },
        animation: { // 动画
            type: '', // 动画类型
            speed: ''
        }
    },
    blocks: []
}

// 空环节配置
const emptyLink = {
    id: 'teachingLink-uuid', // 唯一：uuid
    title: '', // 标题
    description: '', // 描述
    props: { // 属性

    },
    slides: []
}

// 空练习配置
const emptyExercise = {
    id: 'exercise-uuid', // 唯一：uuid
    title: '', // 短期不用，显示时自动生成
    questions: []
}

// block通用结构
const commonBlockConfig = { // 元素
    id: 'block-uuid', // 唯一：uuid
    isQuestion: false,
    type: '', // 类型：'text'|'shape'|'table'|'image'|'question'
    props: {
        position: { // 位置 初始值为居中位置
            left: 180,
            top: 300
        },
        size: { // 尺寸
            width: 600,
            height: 80
        },
        border: { // 边框
            style: '', // dotted|dashed|solid|double等其它css中border-style可支持的类型
            width: 0,
            color: FONT_COLOR
        },
        opacity: 100, // 透明度：0-100
        rotation: 0, // 旋转：0-360
        animation: { // 动画
            effect: '', // 效果：fade in｜
            duration: 0,
            delay: 0,
            index: 0,
            triggle: 'click' // 动画触发时机，click表示单击时触发，comeIn表示入场时触发
        },
        zIndex: 10,
        color: FONT_COLOR
    }
}

// 习题默认值
const questionDefault = fromJS({
    single: {
        answer: 'A',
        options: 4
    },
    multiple: {
        answer: ['A'],
        options: 4
    },
    trueOrFalse: {
        answer: 'right',
        options: 2
    },
    match: {
        answer: ['A', 'B', undefined, undefined, undefined],
        options: 2
    },
    subjective: {
        answer: '',
        options: 1,
        estimateScore: [0]
    }
})

// 习题的通用结构,默认为单选题
const commonQuestion = Map({
    // id: '', // question-uuid
    blockId: '', // 关联元素：blockId | groupId, 'block-' + id
    content: '', // 题干
    type: '', // 选择题｜主观题
    options: 0, // 选项
    answer: '' // 答案
}).merge(questionDefault.get('single'))

export {
    commonBlockConfig,
    commonQuestion,
    emptyExercise,
    emptyLink,
    emptySlide,
    questionDefault
}
