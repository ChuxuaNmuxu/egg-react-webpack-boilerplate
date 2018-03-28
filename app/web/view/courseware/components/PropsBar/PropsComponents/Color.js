import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';
import { TwitterPicker } from 'react-color';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const InputGroup = Input.Group;

class Color extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showColorPicker: false,
            color: '#FF8C00'
        };

        this.toggleColorPicker = this.toggleColorPicker.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
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
        const {type, form: {setFieldsValue}} = this.props
        this.setState({
            color: color.hex
        })
        let state = {};
        state[type] = color.hex;
        setFieldsValue(state)
    }

    render () {
        const {getFieldDecorator} = this.props.form;
        const formItemProps = {
            colon: false
        }
        const type = this.props.type;
        const colorConfig = ['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FF8C00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', 'transparent'];
        return (
            <FormItem
              {...formItemProps}
              label='颜色'
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }} className='fixedLabel'>
                <InputGroup compact size='small' style={{paddingTop: 5, paddingBottom: 5}} >
                    {getFieldDecorator(type, {
                        initialValue: this.state.color
                    })(
                        <span className='ant-input-group-addon btn-color-bg' >
                            <Button type='primary' size='small' className='btn-color' style={{backgroundColor: this.props.form.getFieldValue(type) || '#ff8c00'}} onClick={this.toggleColorPicker} />
                        </span>
                    )}
                </InputGroup>
                {
                    this.state.showColorPicker &&
                    <div style={{ position: 'absolute', zIndex: '2', right: 0 }}>
                        <div style={{position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px'}} onClick={this.handleClose} />
                        <TwitterPicker onChange={this.handleColorChange} color={this.state.color} colors={colorConfig} />
                    </div>
                }
            </FormItem>
        )
    }
}

Color.propTypes = {
    type: PropTypes.string,
    form: PropTypes.object
}

export default Color;
