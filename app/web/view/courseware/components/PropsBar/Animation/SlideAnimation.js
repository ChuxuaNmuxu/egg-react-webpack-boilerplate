import React, {Component} from 'react';
import {Form, Select} from 'antd';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import {slideAnimationList} from '../../../config/AnimationList';
import {changeSlideAnimationEffect, changeAnimationSpeed} from '../../../../../actions/courseware';
import AnimationDisplay from '../PropsComponents/AnimationDisplay';
const FormItem = Form.Item;
const Option = Select.Option;
class SlideAnimation extends Component {
    constructor (props) {
        super(props);

        this.state = {
            animationList: [],
            index: 0,
            effect: ''
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleSelectorAnimationEffect = this.handleSelectorAnimationEffect.bind(this);
        this.hiddenAnimationExhibition = this.hiddenAnimationExhibition.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleMouseEnter (e, index, list) {
        this.setState({
            index,
            animation: list.title
        })
    }

    getListClassName (index) {
        return this.state.index === index ? 'type active' : 'type'
    }

    handleSelectorAnimationEffect (e) {
        this.setState({
            showAnimationExbition: true
        })
    }

    hiddenAnimationExhibition () {
        this.setState({
            showAnimationExbition: false
        })
    }

    handleClick (e, list) {
        const {dispatch} = this.props;
        dispatch(changeSlideAnimationEffect(Map({
            type: list.animation
        })))
    }

    handleClose () {
        this.setState({
            showAnimationExbition: false
        })
    }

    handleChange (value) {
        const {dispatch} = this.props;
        dispatch(changeAnimationSpeed(Map({
            speed: value
        })))
    }

    render () {
        const {animation} = this.props;
        let type = animation.get('type');
        let speed = animation.get('speed');
        const len = slideAnimationList.length;
        for (let i = 0; i < len; i++) {
            if (slideAnimationList[i].animation === type) { // type: fade => value：淡出
                type = slideAnimationList[i].value;
            }
        }
        const formItemProps = {
            colon: false
        }
        const style = {
            height: '150px'
        }
        return (
            <div>
                <FormItem {...formItemProps} label='过场动画'>
                    <AnimationDisplay animationList={slideAnimationList} form={this.props.form} style={style} handleClick={this.handleClick} effect={type} />
                </FormItem>
                <FormItem
                  {...formItemProps}
                  label='速度'
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}>
                    <Select size='small' onChange={this.handleChange} value={speed}>
                        <Option value=''>无</Option>
                        <Option value='slow'>慢速</Option>
                        <Option value='default'>正常</Option>
                        <Option value='fast'>快速</Option>
                    </Select>
                </FormItem>
            </div>
        )
    }
}

SlideAnimation.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    courseware: PropTypes.object,
    animation: PropTypes.object
}

// const mapStateToProps = (state) => {
//     const courseware = state.courseware.present;
//     return {
//         courseware
//     }
// }

export default SlideAnimation;
