import React from 'react';
import {List, Map} from 'immutable';
import PropTypes from 'prop-types';
import Reveal from 'reveal.js';
// let reveal = {}

import utils from '../../../../utils/utils';
import Snap from '../Snap';
import Blocks from '../Block/Blocks';
import PlayBlocks from '../play/BlocksInSlide';
import {SLIDE_HEIGHT, SLIDE_WIDTH} from '../../config/constant';
import {handleSlideMouseMove} from '../../../../reducers/courseware/helper';
import {commonHandlesHoc} from '../helper/Hocs';
import {
    mouseUpOnSlide, selectBlocks,
    mousedownOnSlide, pasteBlock,
    addBlock, copyBlock
} from '../../../../actions/courseware';

class Viewport extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            currentSlide: null,
            // guides: new Array(6).fill(null),
            guides: List().setSize(6),
            courseware: null,
            moveCoor: {},
            courseId: '',
            preview: false,
            dragDir: null
        }

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.createSelectBox = this.createSelectBox.bind(this);
        this.onSlidePaste = this.onSlidePaste.bind(this);
        this.onSlideCopy = this.onSlideCopy.bind(this);
        this.generateSectionClass = this.generateSectionClass.bind(this);
    }

    componentDidMount () {
        // Reveal = require('reveal.js').default;
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount () {
        document.removeEventListener('mouseup', this.handleMouseUp);
    }

    componentWillReceiveProps (nextProps, nextState) {
        const {courseware, preview} = nextProps;
        this.setState({
            courseware,
            preview
        })
    }

    componentDidUpdate () {
        const {preview, exitPreview} = this.props;
        if (preview && !Reveal.getConfig().touch) {
            Reveal.configure({
                touch: true,
                keyboard: {
                    27: exitPreview // exit when ESC is pressed
                },
                controls: true
            });
            Reveal.sync()
        }
    }

    /**
     * 生成选框
     * @param {*object} e
     */
    createSelectBox (e) {
        if (this.selectBox) { return }
        this.selectBox = document.createElement('div');
        Object.assign(this.selectBox.style, {
            position: 'absolute',
            background: `rgba(216,216,216,0.30)`,
            border: `1px solid #999999`,
            zIndex: `100`
        })
        document.querySelector('.present').appendChild(this.selectBox);
    }

    handleMouseDown (e) {
        const { dispatch, preview } = this.props;
        if (preview && !e.target.classList.contains('navigate-left') && !e.target.classList.contains('navigate-right')) {
            Reveal.next();
            return false;
        }
        const slideDom = document.querySelector('.present');
        const {left, top} = slideDom.getBoundingClientRect(); // 卡片距离页面的左右距离
        const newProperty = Map({
            initPageX: e.pageX,
            initPageY: e.pageY,
            slideOffsetLeft: left,
            slideOffsetTop: top,
            isGroupSelect: true
        })
        this.createSelectBox(e);
        dispatch(mousedownOnSlide(newProperty));
    }

    handleMouseMove (e) {
        e.preventDefault();
        const shiftKey = e.shiftKey;
        let {courseware} = this.props;
        const current = courseware.get('current');

        // const { initPageX, initPageY, isDraging, isResizing, isRotating, isGroupSelect, slideOffsetLeft, slideOffsetTop } = current;
        const initPageX = current.get('initPageX');
        const initPageY = current.get('initPageY');
        const isDraging = current.get('isDraging');
        const isResizing = current.get('isResizing');
        const isRotating = current.get('isRotating');
        const isGroupSelect = current.get('isGroupSelect');

        if (isGroupSelect) { // 多选框选取元素时多选框随鼠标移动的样式变化
            const slideOffsetLeft = current.get('slideOffsetLeft');
            const slideOffsetTop = current.get('slideOffsetTop');
            const left = Math.min(e.pageX, initPageX);
            const top = Math.min(e.pageY, initPageY);
            const width = Math.abs(e.pageX - initPageX);
            const height = Math.abs(e.pageY - initPageY);
            Object.assign(this.selectBox.style, {
                left: `${left - slideOffsetLeft}px`,
                top: `${top - slideOffsetTop}px`,
                width: `${width}px`,
                height: `${height}px`
            })
        }

        // 距离点击时鼠标移动的距离
        const moveX = e.pageX - initPageX;
        const moveY = e.pageY - initPageY;
        // 拖拽，拉伸，选中和多选,同时鼠标有移动一段距离（因为紧接mousedown会触发move事件，此时鼠标移动距离都是0）
        if ((isDraging || isResizing || isRotating || isGroupSelect) && (moveX !== 0 || moveY !== 0)) {
            if (isDraging && shiftKey) { // shift拖拽
                if (!this.state.dragDir) {
                    this.setState({
                        dragDir: Math.abs(moveX) - Math.abs(moveY) > 0 ? 'h' : 'v' // 水平、竖直
                    })
                }
            } else {
                this.setState({
                    dragDir: null
                })
            }

            let data = Map({
                moveX: moveX,
                moveY: moveY,
                pageX: e.pageX,
                pageY: e.pageY,
                shiftKey: shiftKey,
                dragDir: this.state.dragDir
            })

            const dataAfterMove = handleSlideMouseMove(this.state.courseware, data);
            const guides = dataAfterMove.get('guides');

            // const {ppt: {slides}, current: {slideIndex}} = courseware;
            const slides = dataAfterMove.getIn(['courseware', 'ppt', 'slides']);
            const slideIndex = dataAfterMove.getIn(['courseware', 'current', 'slideIndex']);
            if (moveX !== 0 || moveY !== 0) {
                this.setState({
                    guides: guides,
                    currentSlide: slides.get(slideIndex),
                    moveCoor: {
                        pageX: e.pageX,
                        pageY: e.pageY
                    }
                })
            }
        }
    }

    handleMouseUp (e) {
        const {dispatch, courseware} = this.props;
        // const {isDraging, isResizing, isRotating, isGroupSelect} = this.props.courseware.current;
        const current = courseware.get('current');

        const isDraging = current.get('isDraging');
        const isResizing = current.get('isResizing');
        const isRotating = current.get('isRotating');
        const isGroupSelect = current.get('isGroupSelect');

        if (isDraging || isResizing || isRotating) { // 拖拽，拉伸，选中和多选
            dispatch(mouseUpOnSlide(Map({
                current: Map({
                    isDraging: false,
                    isResizing: false,
                    isRotating: false
                    // isGroupSelect: false
                }),
                slide: this.state.currentSlide
            })));
        } else if (isGroupSelect) { // 多选
            // 删除选择框
            document.querySelector('.present').removeChild(this.selectBox);
            this.selectBox = null;

            dispatch(selectBlocks(Map({
                pageX: e.pageX,
                pageY: e.pageY
            })))
        }
        this.setState({
            currentSlide: null,
            // guides: new Array(6).fill(null),
            guides: List().setSize(6),
            moveCoor: {
                pageX: null,
                pageY: null
            },
            dragDir: null
        })
    }

    /**
     * 复制事件
     */
    onSlideCopy (e) {
        if (this.props.isEditing()) return;
        e.preventDefault();
        const {dispatch, courseware} = this.props;
        // const {blocks} = courseware.current;
        const blocks = courseware.getIn(['current', 'blocks'])
        if (blocks.size > 0) {
            e.clipboardData.setData('blockCopyed', 'blockCopyed');
            dispatch(copyBlock())
        }
    }

    /**
     * 粘贴事件
     */
    onSlidePaste (e) {
        if (this.props.isEditing()) return;
        const {dispatch, uploadGetParams} = this.props;
        const clipboard = e.clipboardData;
        const isPasetBlock = clipboard.getData('blockCopyed') === 'blockCopyed';
        if (isPasetBlock) {
            dispatch(pasteBlock())
        } else if (clipboard) {
            const {items} = e.clipboardData;
            const item = items[items.length - 1];
            if (item.kind === 'string') {
                item.getAsString((str) => {
                    dispatch(addBlock(Map({
                        blockType: 'text',
                        content: `<p>${str}</p>`
                    })))
                });
            } else if (/image/.test(item.type)) {
                var blob = item.getAsFile();
                const updatePromise = new Promise(resolve => {
                    uploadGetParams().then(res => {
                        if (res.code === 0) { // 请求ali地址成功
                            // const {data: {uploadUrl}} = res;
                            const {data} = res;
                            const uploadData = {
                                key: data.objectKey,
                                OSSAccessKeyId: data.accessId,
                                callback: data.callback,
                                signature: data.signature,
                                success_action_status: 200,
                                policy: data.policy,
                                // 'x:filename': encodeURIComponent(file.name)
                                // 'x:filename': file.name
                                'x:filename': `1.png`
                            }
                            utils.uploadImgToAli(data.uploadUrl, blob, uploadData)
                            .then(data => {
                                resolve(data.url)
                            })
                        } else {
                            console.log(new Error(res))
                        }
                    })
                })

                const loadPromise = new Promise(resolve => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onload = (event) => {
                        let img = new Image();
                        const src = event.target.result;
                        img.src = src;
                        img.onload = (e) => {
                            resolve({
                                width: e.target.width,
                                height: e.target.height
                            })
                        }
                    }
                })

                Promise.all([updatePromise, loadPromise]).then(res => {
                    const src = res[0];
                    const {height, width} = res[1];
                    dispatch(addBlock(Map({
                        width: width,
                        height: height,
                        blockType: 'image',
                        imgUrl: src
                    })))
                })
            }
        }
    }

    /**
     * 生成section类名，避免混乱
     */
    generateSectionClass (slideIndex) {
        // const {current} = this.props.courseware;
        const {currentSlideIndex} = this.props;
        const compare = currentSlideIndex - slideIndex;
        let className = compare > 0 ? 'past' : compare < 0 ? 'future' : 'present';
        return slideIndex === 0 ? `ppt-home-page ${className}` : className;
    }

    /**
     * 生成卡片的属性
     * @param {*Map} slide
     */
    setSlideProps (slide) {
        let props = {};
        const {preview} = this.props;
        if (preview) {
            let {background: {image, color}, animation: {type, speed}} = slide.props;
            props['data-transition'] = type;
            image && (props['data-background-image'] = image);
            color && (props['data-background-color'] = color);
            speed && (props['data-transition-speed'] = speed);
            return props;
        }
        const image = slide.getIn(['props', 'background', 'image']);
        const color = slide.getIn(['props', 'background', 'color']);
        image && (props['data-background-image'] = image);
        color && (props['data-background-color'] = color);
        return props;
    }

    render () {
        const {courseware = Map(), preview = false, currentSlideIndex, dispatch} = this.props;
        const {currentSlide, moveCoor, guides} = this.state;

        let slides = courseware.getIn(['ppt', 'slides']);
        if (preview) {
            slides = slides.toJS();
        }

        return <div className='reveal'
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.handleMouseDown}
          onPaste={this.onSlidePaste}
          onCopy={this.onSlideCopy}
            >
            {!preview && <div className='slide-container' style={{width: SLIDE_WIDTH, height: SLIDE_HEIGHT, maxWidth: SLIDE_WIDTH, maxHeight: SLIDE_HEIGHT}}>
                <div />
            </div>}
            <div className='slides'>
                {
                slides.map((slide, slideIndex) => {
                    return <section
                      {...this.setSlideProps(slide)}
                      key={slideIndex}
                      className={this.generateSectionClass(slideIndex)}
                      style={{height: '100%', padding: 0}}
                    >
                        {
                            preview ? <PlayBlocks slide={slide} index={slideIndex} />
                            : <Blocks
                              item={slideIndex === currentSlideIndex && currentSlide ? currentSlide : slide}
                              index={slideIndex}
                              moveCoor={moveCoor}
                              dispatch={dispatch}
                            />
                        }
                    </section>
                })
            }
                {!preview && <Snap guides={guides} />}
            </div>
        </div>
    }
}

Viewport.propTypes = {
    currentSlide: PropTypes.object,
    currentSlideIndex: PropTypes.number,
    slides: PropTypes.object,
    dispatch: PropTypes.func,
    moveCoor: PropTypes.object,
    children: PropTypes.node,
    courseware: PropTypes.object,
    uploadGetParams: PropTypes.func,
    isEditing: PropTypes.func,
    preview: PropTypes.bool,
    exitPreview: PropTypes.func
}

export default commonHandlesHoc()(Viewport);
