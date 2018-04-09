import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { connect } from 'react-redux';
import domtoimage from 'dom-to-image';
// import elementResizeEvent from 'element-resize-event';
import {Map} from 'immutable';
import Reveal from 'reveal.js';
// let reveal = {}


import styles from './Block.scss';
import Transform from './Transform';
import {clickBlock, questionSnapshoot} from '../../../../actions/courseware';
import {blockWrapConfig, blockContentConfig} from '../../config/propsConfig';
import {QUESTION_SAVE_MODE} from '../../config/constant';
import {createStyle, isGroupIndex, updateQuestion} from '../../../../reducers/courseware/helper';

const saveQuestionHTML = QUESTION_SAVE_MODE === 'HTML'

class Block extends React.Component {
    constructor (props) {
        super(props);
        const style = {
            transform: ''
        };
        const filter = node => ['eb-transform'].indexOf(node.className) === -1;
        this.state = {
            initX: 0,
            initY: 0,
            options: {
                style,
                filter
            },
            shiftKey: false
        }

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.snapshoot = this.snapshoot.bind(this);
        this.isMoving = this.isMoving.bind(this);
    }

    handleMouseDown (e) {
        e.stopPropagation();
        const {
            dispatch,
            index, // 元素block在卡片slide中的索引值
            groupIndex, // group元素所在组的index
            me // 元素block的数据
        } = this.props;

        const shiftKey = e.shiftKey || e.ctrlKey;
        let newProperty = Map({ // 被选中时block的初始数据，存到current中
            initPageX: e.pageX,
            initPageY: e.pageY,
            shiftKey: shiftKey
        });
        console.log('block component state rotation:', e.target.dataset.hasOwnProperty('rotation'));
        if (e.target.dataset.hasOwnProperty('direction')) { // 判断拖拽，拉伸，选中的状态
            // newProperty.isResizing = true;
            // newProperty.resizeDirection = e.target.dataset.direction;
            newProperty = newProperty.withMutations(property => {
                property
                .set('isResizing', true)
                .set('resizeDirection', e.target.dataset.direction)
            })
        } else if (e.target.dataset.hasOwnProperty('rotation')) {
            // newProperty.isRotating = true;
            newProperty = newProperty.set('isRotating', true);
        } else {
            // newProperty.isDraging = true;
            newProperty = newProperty.set('isDraging', true);
        }

        this.setState({
            initX: e.pageX,
            initY: e.pageY,
            shiftKey
        })
        dispatch(clickBlock(Map({
            index: index,
            groupIndex: groupIndex,
            blockId: me.get('id'),
            newProperty: newProperty
        })));
    }

    componentDidMount () {
        // Reveal = require('reveal.js').default;
        if (saveQuestionHTML) return;
        const {me, courseware} = this.props;
        if (me.get('type') === 'group') {
            const question = updateQuestion(courseware, null, me.get('id'));
            if (!question.get('content')) {
                this.snapshoot();
            }
        }
    }

    componentWillReceiveProps (nextProps) { // 组件更新完成习题元素需要重新截图
        const {me} = nextProps;
        const {me: prveMe} = this.props;
        const props = this.propsFilter(me);
        const prevProps = this.propsFilter(prveMe);
        this.needSnapShoot = !saveQuestionHTML && me.get('isQuestion') && !prevProps.equals(props);
    }

    propsFilter (block) {
        return block.withMutations(block => {
            block
            .deleteIn(['props', 'animation'])
            .deleteIn(['props', 'position'])
            .deleteIn(['props', 'zIndex'])
            // .deleteIn(['props', 'rotation'])
        })
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.needSnapShoot) { // 拖动截取最后一次
            clearTimeout(this.shootTimer);
            this.shootTimer = setTimeout(this.snapshoot, 300)
        }

        // if (this.needChangeWrap) {
        //     const {left, top, height, width} = this.element.getBoundingClientRect();
        //     const {dispatch} = prevProps;
        //     const slideDom = document.querySelector('.present');
        //     const {left: slideLeft, top: slideTop} = slideDom.getBoundingClientRect(); // 卡片距离页面的左右距离
        //     dispatch(changeWrapBlock(Map({
        //         'position.left': left - slideLeft,
        //         'position.top': top - slideTop,
        //         'size.width': width,
        //         'size.height': height
        //     })))
        // }
    }

    componentWillUnmount () {
        clearTimeout(this.shootTimer);
    }

    snapshoot () {
        const {me, dispatch} = this.props;
        // node.style.transform = '';

        const {height, width} = this.element.querySelector('.block-content').getBoundingClientRect();
        const scale = Reveal.getScale();
        const options = {
            ...this.state.options,
            width: Math.floor(width / scale),
            height: Math.floor(height / scale),
            style: Object.assign({}, this.state.options.style, {
                position: 'unset'
            })}

        domtoimage.toPng(this.element, options).then((canvas) => {
            dispatch(questionSnapshoot(Map({
                blockId: me.get('id'),
                snapshoot: canvas
            })))
        })
    }

    /**
     * 判断处于聚焦的状态
     */
    isFocused () {
        const {index, groupIndex, courseware} = this.props;  // 当前block的索引
        const current = courseware.get('current');
        const blocks = current.get('blocks');

        let isFocused = false;
        if (isGroupIndex(groupIndex)) { // 当前block是组合习题内的元素
            isFocused = blocks.some((block) => block.get('groupIndex') === groupIndex && block.get('index') === index)
        } else {
            // true: 组合习题在有内部元素被选中或者非组合习题则index相等
            isFocused = blocks.some((block) => (block.get('groupIndex') === undefined && block.get('index') === index) || index === block.get('groupIndex'))
        }

        return isFocused;
    }

    isMoving () {
        const {moveCoor: {pageX, pageY}} = this.props;
        const isMoving = pageX ? pageX - this.state.initX !== 0 || pageY - this.state.initY !== 0 : false
        return isMoving;
    }

    render () {
        let Transform = this.props.transform;
        let children = this.props.children || '空元素';

        // const {me: {type, props}, isMoving} = this.props;
        const {me, courseware, dispatch} = this.props;

        let blockStyle = createStyle(me, blockWrapConfig)
        let contentStyle = createStyle(me, blockContentConfig);

        return (
            <div className='ppt-block' styleName='ppt-block' style={blockStyle} onMouseDown={this.handleMouseDown} ref={e => { this.element = e }}>
                <div className='block-content' style={contentStyle}>
                    {children}
                </div>
                {this.isFocused()
                    ? <Transform
                      blockProps={this.props}
                      isFocused={this.isFocused()}
                      isMoving={this.isMoving()}
                      courseware={courseware}
                      dispatch={dispatch}
                      shiftKey={this.state.shiftKey}
                    /> : null}
            </div>
        )
    }
}

Block.propTypes = {
    transform: PropTypes.any,
    children: PropTypes.any,
    index: PropTypes.number,
    dispatch: PropTypes.func,
    current: PropTypes.object,
    me: PropTypes.object,
    groupIndex: PropTypes.number,
    isMoving: PropTypes.bool,
    courseware: PropTypes.object,
    moveCoor: PropTypes.object
}

Block.defaultProps = {
    transform: Transform
}

const mapStateToProps = (state) => {
    // const {courseware} = state;
    const courseware = state.courseware.present;
    return {
        courseware
    }
}

export default connect(mapStateToProps)(CSSModules(Block, styles));
