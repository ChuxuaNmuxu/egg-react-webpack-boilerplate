import React from 'react';

export default {
    name: 'test2', // 名称
    title: '测试2', // 标题
    icon: 'iconfont icon-wenben', // 图标
    description: '这是测试默认事件自定义模板', // 描述
    toolbar: () => <div>测试2</div>, // 自定义工具栏
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