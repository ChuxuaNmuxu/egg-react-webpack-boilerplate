import {fromJS} from 'immutable';

export const defaultBlockConfig = fromJS({
    name: 'default', // 名称
    title: '默认', // 标题
    icon: 'iconfont icon-link', // 图标
    description: '这是默认元素', // 描述
    onClick: function (block, BlockUtils) {
        BlockUtils.addBlock(block);
    },
    toolbar: null, // 自定义工具栏
    propsbar: null, // 自定义属性栏
    props: { // 属性
        propA: { // 属性项
            title: '属性A',
            value: 111, // 值
            component: null, // 所用控件
            validator: [] // 验证规则
            // ……
        }
    }
});

export const blocks = fromJS([
    {
        name: 'default', // 名称
        title: '默认', // 标题
        icon: 'iconfont icon-link', // 图标
        description: '这是默认元素', // 描述
        toolbar: null, // 自定义工具栏
        propsbar: null, // 自定义属性栏
        props: { // 属性
            // propB: { // 属性项
            //     value: '', // 值
            //     component: null, // 所用控件
            //     validator: [] // 验证规则
            //     // ……
            // }
        }
    }
]);
