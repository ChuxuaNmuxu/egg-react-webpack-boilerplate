import React from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Icon, message} from 'antd';
import Menus from './OptionMenu/MenuTypes'
import {Map} from 'immutable';

import {clickOptionBtn} from '../../../../actions/courseware';
import transformConfig from '../../config/TransformType';
import {updateBlocks} from '../../../../reducers/courseware/helper';
import {getExerciseByBlockId} from '../../../../reducers/courseware/exercise';

/**
 * 元素块变形移动行为辅助框
 */
class Transform extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: false
        }

        this.handleClickDropdown = this.handleClickDropdown.bind(this);
        this.handleVisibleChange = this.handleVisibleChange.bind(this);
        // this.isDoubleClick = this.isDoubleClick.bind(this);
        // this.handleMouseDown = this.handleMouseDown.bind(this);
        // this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    handleClickDropdown (e) {
        const {dispatch, blockProps: {index, me}} = this.props;
        if (e.key === 'question' && this.nestQuestion()) { // 习题不能作为组合习题的内部元素
            message.info('暂不支持组合习题内包含习题元素')
        } else {
            dispatch(clickOptionBtn(Map({
                type: e.key,
                index: index,
                blockId: me.get('id')
            })))
        }

        this.setState({
            visible: false
        })
    }

    /**
     * 生成习题时所选中的元素中有question或member类型
     */
    nestQuestion () {
        const {courseware} = this.props;
        const blocks = courseware.getIn(['current', 'blocks']);

        let isNest = false;
        blocks.forEach((block, index) => {
            const groupIndex = block.get('groupIndex');
            const isQuestion = updateBlocks(courseware).getIn([block.get('index'), 'isQuestion']);

            if (groupIndex || isQuestion) {
                isNest = true;
                return false;
            }
        })
        return isNest;
    }

    handleVisibleChange = (flag) => {
        this.setState({ visible: flag });
    }

    // handleMouseDown (e) {
        // console.log('transfromclick')
        // const { dispatch, blockProps: {index, me, groupIndex} } = this.props;
        // const {type, id} = me;
        // if (this.isDoubleClick() && (type === 'text' || type === 'table')) {
        //     dispatch(editBlock({
        //         index,
        //         groupIndex,
        //         blockId: id,
        //         me
        //     }))
        // } else {
        //     // e.stopPropagation();
        //     const newProperty = {
        //         initPageX: e.pageX,
        //         initPageY: e.pageY,
        //         shiftKey: e.shiftKey
        //     }
        //     if (e.target.dataset.hasOwnProperty('direction')) {
        //         newProperty.isResizing = true;
        //         newProperty.resizeDirection = e.target.dataset.direction;
        //     } else if (e.target.dataset.hasOwnProperty('draggable')) {
        //         newProperty.isDraging = true;
        //     } else if (e.target.dataset.hasOwnProperty('rotation')) {
        //         newProperty.isRotating = true;
        //     }

        //     dispatch(clickBlock({
        //         index,
        //         groupIndex,
        //         blockId: id,
        //         newProperty
        //     }));
        // }
    // }

    // isDoubleClick () {
    //     let isDblClick = false;
    //     if (this.mouseDownTime) {
    //         isDblClick = new Date().getTime() - this.mouseDownTime < 300;
    //     }
    //     this.mouseDownTime = new Date().getTime();
    //     return isDblClick;
    // }

    /**
     * 判断是组合习题内的元素
     * @param {*number} groupIndex
     */
    isMember (groupIndex) {
        return typeof groupIndex === 'number';
    }

    componentWillReceiveProps (nextProps) {
        const {isFocused, isMoving, blockProps: {me}, shiftKey} = nextProps;
        this.setState({
            clickThrough: (!isMoving && isFocused && !shiftKey) || me.get('type') === 'group' ? 'none' : 'auto' // none: 点击穿透
        })
    }

    render () {
        // const {current, blockProps} = this.props;
        const {blockProps, courseware} = this.props;

        const transformStyle = {transform: `rotate(${blockProps.me.getIn(['props', 'rotation'])}deg)`, pointerEvents: this.state.clickThrough}; // 样式
        // const transformStyle = {transform: `rotate(${blockProps.me.getIn(['props', 'rotation'])}deg)`}; // 样式
        const {me, groupIndex} = blockProps;
        // const {me: {type, isQuestion}, index, groupIndex} = blockProps;
        // const type = blockProps.getIn(['me', 'type']);
        // const isQuestion = blockProps.getIn(['me', 'isQuestion']);
        // const index = blockProps.get('index');
        // const groupIndex = blockProps.get('groupIndex');
        const type = me.get('type');
        const isQuestion = me.get('isQuestion');

        let questionNum = 1;
        let questionIndex = 0;
        if (isQuestion) {
            const blockId = me.get('id');
            const exercise = getExerciseByBlockId(courseware, blockId);
            const questions = exercise.get('questions');
            questionNum = questions.size;
            questionIndex = questions.findIndex(question => question.get('blockId') === blockId);
        }

        // let isFcouse = false;
        // if (this.isMember(groupIndex)) {
        //     isFcouse = current.blocks.some((block) => block.groupIndex === groupIndex && block.index === index)
        // } else {
        //     isFcouse = current.blocks.some((block) => typeof block.groupIndex !== 'number' && block.index === index);
        // }
        const menuType = isQuestion ? 'question' : type;
        const MenuComponent = Menus[menuType];
        const menu = <MenuComponent handleClickDropdown={this.handleClickDropdown} />
        let config = transformConfig.common;
        if (this.isMember(groupIndex)) {
            config = transformConfig.member
        } else if (/table|group|text/.test(type)) {
            config = transformConfig[type]
        }
        config.questionNum = isQuestion;

        return <div className='eb-transform' style={transformStyle} data-draggable='draggable' onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
            <div>
                {config.fastOption
                    ? <Dropdown overlay={menu} visible={this.state.visible} onVisibleChange={this.handleVisibleChange}>
                        <div className='option-btn'>
                            <Icon type='setting' />
                        </div>
                    </Dropdown> : null
                    }
                {config.questionNum
                        ? <div className='questionNum'>
                            <span>{questionIndex + 1}</span>
                            <span className='division'>/</span>
                            <span>{questionNum}</span>
                        </div> : null
                    }
                <div className='eb-rotatable' data-rotation='rotation' >
                    <div className={'eb-rotatable-line ' + (config.up ? '' : 'noUpArchor')} />
                </div>
                {config.up
                        ? <div className='eb-draggable-up'>
                            <div className='eb-resizable-n eb-resizable' data-direction='n' />
                            <div className='eb-resizable-nw eb-resizable' data-direction='nw' />
                            <div className='eb-resizable-ne eb-resizable' data-direction='ne' />
                        </div> : null
                    }
                {config.right
                        ? <div className='eb-draggable-right'>
                            <div className='eb-resizable-e eb-resizable' data-direction='e' />
                        </div>
                     : null}
                {config.bottom
                         ? <div className='eb-draggable-bottom' >
                             <div className='eb-resizable-s eb-resizable' data-direction='s' />
                             <div className='eb-resizable-sw eb-resizable' data-direction='sw' />
                             <div className='eb-resizable-se eb-resizable' data-direction='se' />
                         </div>
                     : null}
                {config.left
                        ? <div className='eb-draggable-left'>
                            <div className='eb-resizable-w eb-resizable' data-direction='w' />
                        </div>
                    : null}
            </div>
        </div>
    }
}

Transform.propTypes = {
    dispatch: PropTypes.func,
    blockProps: PropTypes.any,
    current: PropTypes.object,
    handleSnapshoot: PropTypes.func,
    isFocused: PropTypes.bool,
    courseware: PropTypes.object,
    isMoving: PropTypes.bool,
    shiftKey: PropTypes.bool
}

export default Transform;
