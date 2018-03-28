import React from 'react';
import PropTypes from 'prop-types';
import {Form, Input, InputNumber, Col, Select, Button} from 'antd';
import {connect} from 'react-redux';

import {zIndexUp, zIndexDown} from '../../../../actions/courseware';
import Color from './PropsComponents/Color';
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const format = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
}

class BaseProps extends React.Component {
    constructor (props) {
        super(props);
        console.log(12312, props);

        this.state = {
            showColorPicker: false,
            borderColor: '',
            showAnimationExbition: false
        }

        this.toggleColorPicker = this.toggleColorPicker.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        // this.handleZIndexDown = this.handleZIndexDown.bind(this);
        // this.handleZIndexUp = this.handleZIndexUp.bind(this);
    }

    toggleColorPicker () {
        this.setState({
            showColorPicker: !this.state.showColorPicker
        })
    }

    handleClose () {
        this.setState({
            showColorPicker: false
        })
    }

    handleColorChange (color) {
        const {setFieldsValue} = this.props.form;
        this.setState({
            borderColor: color.hex
        })
        setFieldsValue({
            'border.color': color.hex
        })
    }

    render () {
        const {getFieldDecorator} = this.props.form;
        console.log(666, this.props.form);
        const formItemProps = {
            colon: false
        }

        return (
            <div className='base-props'>
                {/* <FormItem {...formItemProps} label='尺寸'>
                    <Col span='12' className='clearfix'>
                        <FormItem
                          {...formItemProps}
                          label='宽'
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('size.width')(
                                <Input size='small' />
                                )}
                        </FormItem>
                    </Col>
                    <Col span='12' className='clearfix'>
                        <FormItem
                          {...formItemProps}
                          label='高'
                          labelCol={{ span: 8 }}
                          wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('size.height')(
                                <Input size='small' />
                                )}
                        </FormItem>
                    </Col>
                </FormItem>
                <hr className='divider' /> */}
                <FormItem {...formItemProps} label='边框'>
                    <FormItem
                      {...formItemProps}
                      {...format}
                      label='类型'
                      >
                        {getFieldDecorator('border.style', {
                            initialValue: ''
                        })(
                            <Select size='small'>
                                <Option value=''>无</Option>
                                <Option value='solid'><div style={{width: '160px', height: '20px', paddingTop: '10px'}}><hr style={{border: 0, borderBottomWidth: 1, borderBottomStyle: 'solid'}} /></div></Option>
                                <Option value='dotted'><div style={{width: '160px', height: '20px', paddingTop: '10px'}}><hr style={{border: 0, borderBottomWidth: 1, borderBottomStyle: 'dotted'}} /></div></Option>
                                <Option value='dashed'><div style={{width: '160px', height: '20px', paddingTop: '10px'}}><hr style={{border: 0, borderBottomWidth: 1, borderBottomStyle: 'dashed'}} /></div></Option>
                            </Select>
                            )}

                    </FormItem>
                    <FormItem
                      {...formItemProps}
                      {...format}
                      label='宽度'
                      className='borderWidth fixedLabel'>
                        <InputGroup compact size='small'>
                            {getFieldDecorator('border.width', {
                                initialValue: 0,
                                rules: [{required: true}, {pattern: /^([0-9]|10)$/}]
                            })(
                                <InputNumber min={0} max={10} size='small' style={{display: 'table-cell'}} />
                            )}
                            <span className='ant-input-group-addon'>
                                <span>px</span>
                            </span>
                        </InputGroup>
                    </FormItem>
                    <Color type='border.color' form={this.props.form} />
                </FormItem>
                <hr className='divider' />
                <FormItem
                  {...formItemProps}
                  label='不透明度'
                  {...format}
                  className='transportSetting fixedLabel'>
                    <InputGroup compact size='small'>
                        {getFieldDecorator('opacity', {
                            initialValue: 100,
                            rules: [{required: true}, {pattern: /^(100|[0-9]?[0-9])$/}]
                        })(
                            <InputNumber min={0} max={100} size='small' style={{display: 'table-cell'}} />
                        )}
                        <span className='ant-input-group-addon'>
                            <span>%</span>
                        </span>
                    </InputGroup>
                </FormItem>
                <FormItem
                  {...formItemProps}
                  label='旋转'
                  {...format}
                  className='fixedLabel'>
                    <InputGroup compact size='small' style={{paddingTop: 5, paddingBottom: 5}} >
                        {getFieldDecorator('rotation', {
                            initialValue: 0,
                            rules: [{required: true}, {pattern: /^(360|3[0-5][0-9]|[0-2]?[0-9]?[0-9])$/}]
                        })(
                            <InputNumber min={0} max={360} size='small' style={{display: 'table-cell'}} formatter={value => parseInt(value)} parser={value => value + ''} />
                        )}
                        <span className='ant-input-group-addon'>
                            <span>度</span>
                        </span>
                    </InputGroup>
                </FormItem>
                <hr className='divider' />
                <FormItem
                  {...formItemProps}
                  label='层级'
                  {...format}
                  className='transportSetting'>
                    <Col span='6' offset='2'>
                        <Button type='primary' icon='up' size='small' onClick={this.props.zIndexUp} />
                    </Col>
                    <Col span='6'>
                        <Button type='primary' icon='down' size='small' onClick={this.props.zIndexDown} />
                    </Col>
                </FormItem>
            </div>
        );
    }
}

BaseProps.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    zIndexUp: PropTypes.func,
    zIndexDown: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
    return {
        zIndexDown: () => {
            return dispatch(zIndexDown())
        },
        zIndexUp: () => {
            return dispatch(zIndexUp())
        }
    }
}

export default connect(null, mapDispatchToProps)(BaseProps);
