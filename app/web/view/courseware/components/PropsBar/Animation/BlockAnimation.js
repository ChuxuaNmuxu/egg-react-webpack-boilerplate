import React, {Component} from 'react';
import {Form, Input, InputNumber, Select} from 'antd';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import {blockAnimationList} from '../../../config/AnimationList';
import {changeAnimationAffect} from '../../../../../actions/courseware';
import AnimationDisplay from '../PropsComponents/AnimationDisplay';
const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

class BlockAnimation extends Component {
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
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
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
        console.log('blockAnimation list:', list);
        dispatch(changeAnimationAffect(Map({
            effect: list.title
        })))
    }

    handleClose () {
        this.setState({
            showAnimationExbition: false
        })
    }

    render () {
        const {animation} = this.props;

        const len = blockAnimationList.length;
        let effect = '';
        for (let i = 0; i < len; i++) {
            if (blockAnimationList[i].title === animation.get('effect')) {
                effect = blockAnimationList[i].value
                break;
            }
        }
        const commonInTriggle = animation.get('triggle') === 'comeIn';
        const formItemProps = {
            colon: false
        }
        const {getFieldDecorator} = this.props.form;
        return (
            <FormItem {...formItemProps} label='动画'>
                <FormItem
                  {...formItemProps}
                  label='触发'
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}>
                    {getFieldDecorator('animation.triggle', {
                        initialValue: 'click'
                    })(
                        <Select size='small'>
                            <Option value='click'>单击时触发</Option>
                            <Option value='comeIn'>入场时触发</Option>
                        </Select>
                    )}
                </FormItem>
                <AnimationDisplay animationList={blockAnimationList} form={this.props.form} effect={effect} handleClick={this.handleClick} />
                {
                    commonInTriggle
                    ? <div>
                        <FormItem
                          {...formItemProps}
                          label='时长'
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 20 }}>
                            <InputGroup compact size='small' style={{paddingTop: 5, paddingBottom: 5}}>
                                {getFieldDecorator('animation.duration', {
                                    initialValue: 0,
                                    rules: [{required: true}, {pattern: /^([0-9]|10)$/}]
                                })(
                                    <InputNumber min={0} max={10} size='small' style={{display: 'table-cell'}} />
                                        )}
                                <span className='ant-input-group-addon'>
                                    <span>s</span>
                                </span>
                            </InputGroup>
                        </FormItem>
                        <FormItem
                          {...formItemProps}
                          label='延迟'
                          labelCol={{ span: 4 }}
                          wrapperCol={{ span: 20 }}>
                            <InputGroup compact size='small' style={{paddingTop: 5, paddingBottom: 5}}>
                                {getFieldDecorator('animation.delay', {
                                    initialValue: 0,
                                    rules: [{required: true}, {pattern: /^([0-9]|10)$/}]
                                })(
                                    <InputNumber min={0} max={10} size='small' style={{display: 'table-cell'}} />
                                        )}
                                <span className='ant-input-group-addon'>
                                    <span>s</span>
                                </span>
                            </InputGroup>
                        </FormItem>

                    </div> : <FormItem
                      {...formItemProps}
                      label='次序'
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}>
                        <InputGroup compact size='small' style={{paddingTop: 5, paddingBottom: 5}}>
                            {getFieldDecorator('animation.index', {
                                initialValue: 0,
                                rules: [{required: true}, {pattern: /^([0-9]?[0-9])$/}]
                            })(
                                <InputNumber min={0} max={10} size='small' style={{display: 'table-cell'}} />
                                )}
                        </InputGroup>
                    </FormItem>
                }
            </FormItem>
        )
    }
}

BlockAnimation.propTypes = {
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

export default BlockAnimation;
