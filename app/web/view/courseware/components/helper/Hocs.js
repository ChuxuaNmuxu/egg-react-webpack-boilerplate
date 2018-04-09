import Reveal from 'reveal.js';
// let reveal = {}

/**
 * 播放和编辑页面相同的操作
 * @param {*object} config 配置
 */
const commonHandlesHoc = config => wrapperComponent =>
    class commonComponent extends wrapperComponent {
        componentDidMount () {
            // Reveal = require('reveal.js').default;
            super.componentDidMount();
            // 滚轮事件
            const revealDom = document.querySelector('.reveal');
            revealDom.addEventListener('mousewheel', this.handleMouseWheel);
            revealDom.addEventListener('DOMMouseScroll', this.handleMouseWheel); // 火狐

            const _this = this;
            // 动画重绘，每次进入卡片时动画都会重新播放
            Reveal.addEventListener('slidechanged', function (event) {
                // event.previousSlide, event.currentSlide, event.indexh, event.indexv
                if (_this.state.preview === false) return false;
                const aniBlocks = event.currentSlide.querySelectorAll('.play-block');
                for (let block of aniBlocks) {
                    const ani = block.style.animation;
                    block.style.animation = '';
                    setTimeout(() => {
                        block.style.animation = ani;
                    })
                }
            });
        }

        /**
         * 滚轮事件
         * @param {*object} e
         */

        handleMouseWheel (e) {
            let wheelDelta = e.wheelDelta;
            if (e.detail) { // 兼容火狐
                wheelDelta = e.detail;
            }

            wheelDelta > 0 ? Reveal.prev() : Reveal.next();
        }

        render () {
            return super.render()
        }
    }

export {
    commonHandlesHoc
};
