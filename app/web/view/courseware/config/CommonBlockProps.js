/**
 * 通用属性
 */
const commonBlockProps = { // 元素
    id: '', // block-' + id; 唯一：uuid
    isQuestion: false, // 是否是题目

    type: 'text', // 类型：'text'|'shape'|'table'|'image'|'question'
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
            color: ''
        },
        opacity: 1, // 透明度：0-100
        rotation: 0, // 旋转：0-360
        animation: { // 动画
            effect: '', // 效果：fade in｜
            duration: '',
            delay: '',
            index: -1 // 如果需要点击出现的动画，该值为点击顺序，否则值为-1
        },
        zIndex: 10
    }
};

export default commonBlockProps;
