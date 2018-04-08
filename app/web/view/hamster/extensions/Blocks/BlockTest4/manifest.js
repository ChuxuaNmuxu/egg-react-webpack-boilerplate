import Toolbar from './Toolbar';

export default {
    name: 'test4', // 名称
    title: '测试4', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '这是测试自定义事件自定义模板', // 描述
    onClick: function (block, BlockUtils) {
        BlockUtils.addBlock(block);
    },
    toolbar: Toolbar, // 自定义工具栏
    propsbar: null, // 自定义属性栏
    props: { // 属性
        // propA: { // 属性项
        //     title: '属性A',
        //     value: '', // 值
        //     component: null, // 所用控件
        //     validator: [] // 验证规则
        //     // ……
        // }
    }
}
