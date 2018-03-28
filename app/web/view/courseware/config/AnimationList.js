const blockAnimationList = [{
    value: '放大',
    title: 'grow'
},
{
    value: '缩小',
    title: 'shrink'
},
{
    value: '淡入',
    title: 'fade-in'
},
{
    value: '淡出',
    title: 'fade-out'
},
{
    value: '从下滑入',
    title: 'fade-up'
},
{
    value: '从上滑入',
    title: 'fade-down'
},
{
    value: '从右滑入',
    title: 'fade-left'
},
{
    value: '从左滑入',
    title: 'fade-right'
}]

const slideAnimationList = [{
    title: 'slide-fade-in',
    animation: 'fade',
    value: '淡入'
}, {
    title: 'slide-slide-in',
    animation: 'slide',
    value: '滑入'
}, {
    title: 'slide-convex-in',
    animation: 'convex',
    value: '凸面滑入'
},
{
    title: 'slide-concave-in',
    animation: 'concave',
    value: '凹面滑入'
},
{
    title: 'slide-zoom-in',
    animation: 'zoom',
    value: '放大'
}]

const comeOutList = [{
    title: 'slide-fade-out',
    animation: 'fade-out',
    value: '淡出'
}, {
    title: 'slide-slide-out',
    animation: 'slide-out',
    value: '滑出'
}, {
    title: 'slide-convex-out',
    animation: 'convex-out',
    value: '凸面滑出'
},
{
    title: 'slide-concave-out',
    animation: 'concave-out',
    value: '凹面滑出'
},
{
    title: 'slide-zoom-out',
    animation: 'zoom-out',
    value: '放大'
}]

const speed = [{
    title: 'default',
    value: '正常'
}, {
    title: 'slow',
    value: '缓慢'
}, {
    title: 'fast',
    value: '快速'
}]

export {
    blockAnimationList,
    comeOutList,
    speed,
    slideAnimationList
};
