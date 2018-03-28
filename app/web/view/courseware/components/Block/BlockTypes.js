import TextBlock from './TextBlock';
import ShapeBlock from './ShapeBlock';
import TableBlock from './TableBlock/TableBlock';
import ImageBlock from './ImageBlock';
import QuestionBlock from './QuestionBlock';
import LineBlock from './LineBlock';
import GroupBlock from './GroupBlock';

export default {
    text: {
        text: '文本',
        component: TextBlock
    },
    shape: {
        text: '形状',
        component: ShapeBlock
    },
    table: {
        text: '表格',
        component: TableBlock
    },
    image: {
        text: '图片',
        component: ImageBlock
    },
    question: {
        text: '练习',
        component: QuestionBlock
    },
    line: {
        text: '线条',
        component: LineBlock
    },
    group: {
        text: '组合习题',
        component: GroupBlock
    }
};
