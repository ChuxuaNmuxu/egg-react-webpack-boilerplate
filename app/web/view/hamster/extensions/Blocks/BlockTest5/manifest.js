import Toolbar from './Toolbar';

export default {
    name: 'test5', // 名称
    title: '测试5', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '这是测试阻止事件且自定义模板', // 描述
    toolbar: Toolbar, // 自定义工具栏
    onClick: null,
    propsbar: null, // 自定义属性栏
    props: { // 属性
        propB: { // 属性项
            title: '属性B', // 标题
            value: 333, // 值
            component: null, // 所用控件
            validator: [] // 验证规则
            // ……
        }
    }
}
