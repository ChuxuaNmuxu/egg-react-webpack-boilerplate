import TextProps from './TextProps';
import ShapeProps from './ShapeProps';
import TableProps from './TableProps';
import ImageProps from './ImageProps';
import QuestionProps from './QuestionProps';
import SlideProps from './SlideProps';
import GroupProps from './GroupProps';

export default {
    text: {
        text: '文本',
        component: TextProps
    },
    shape: {
        text: '形状',
        component: ShapeProps
    },
    table: {
        text: '表格',
        component: TableProps
    },
    image: {
        text: '图片',
        component: ImageProps
    },
    question: {
        text: '练习',
        component: QuestionProps
    },
    slide: {
        text: '卡片',
        component: SlideProps
    },
    group: {
        text: '组合',
        component: GroupProps
    }
};
