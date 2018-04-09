import React, {Component} from 'react';
import {Form, Col, Button} from 'antd';
import PropTypes from 'prop-types';
import Reveal from 'reveal.js';
// let reveal = {}
import {Map, fromJS} from 'immutable';
import { TwitterPicker } from 'react-color';
import {connect} from 'react-redux';

import {slideAddBackground, slideRemoveBackground, slideAddBackgroundColor, slideRemoveBackgroundColor} from '../../../../actions/courseware';
import * as courseEntryActions from '../../../../actions/courseEntry';
import UploadImage from '../UploadImage';
const FormItem = Form.Item;

class SlideProps extends Component {
    constructor (props) {
        super(props);
        this.state = {
            modelVisible: false,
            showColorPicker: false,
            color: '#FF8C00'
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleRemoveBackground = this.handleRemoveBackground.bind(this);
        this.toggleColorPicker = this.toggleColorPicker.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.bgColorChange = this.bgColorChange.bind(this);
        this.handleRemoveBgColor = this.handleRemoveBgColor.bind(this);
        this.handleChangeBackgroundImage = this.handleChangeBackgroundImage.bind(this);
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

    handleClick () {
        this.setState({
            modelVisible: !this.state.modelVisible
        })
    }

    handleChangeBackgroundImage (width, height, imgUrl) {
        this.props.addBackground(imgUrl);
        Reveal.sync();
    }

    handleRemoveBackground () {
        const {removeBackground} = this.props;
        setTimeout(() => {
            removeBackground();
            Reveal.sync();
        }, 1);
    }

    bgColorChange (color) {
        const { changeBgColor } = this.props;
        this.setState({
            color: color.hex
        })
        setTimeout(() => {
            changeBgColor(color);
            Reveal.sync();
        }, 1);
    }

    handleRemoveBgColor () {
        const {removeBgColor} = this.props;
        setTimeout(() => {
            removeBgColor();
            Reveal.sync();
        }, 1);
    }

    // componentDidMount () {
    //     Reveal = require('reveal.js').default;
    // }

    render () {
        const colorConfig = ['#4D4D4D', '#999999', '#FFFFFF', '#F44E3B', '#FE9200', '#FCDC00', '#333333', '#808080', '#cccccc', '#D33115', '#E27300', '#FCC400', '#000000', '#666666', '#B3B3B3', '#9F0500', '#C45100', '#FF8C00', '#DBDF00', '#A4DD00', '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#B0BC00', '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF', '#808900', '#194D33', '#0C797D', '#0062B1', '#653294', 'transparent'];
        return <div>
            <FormItem>
                <Col span='12'>
                    <Button onClick={this.handleClick}>更换背景图片</Button>
                    <UploadImage
                      handleVisible={this.handleClick}
                      visible={this.state.modelVisible}
                      addBlock={this.handleChangeBackgroundImage}
                      uploadGetParams={this.props.getUploadParams}
                    />
                </Col>
                <Col span='12'>
                    <Button onClick={this.handleRemoveBackground}>移除背景图片</Button>
                </Col>
                <Col span='12'>
                    <Button onClick={this.toggleColorPicker}>改变背景颜色</Button>
                    {
                        this.state.showColorPicker &&
                        <div style={{ position: 'absolute', zIndex: '2', right: '-116px', top: '41px' }}>
                            <div style={{position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px'}} onClick={this.handleClose} />
                            <TwitterPicker onChange={this.bgColorChange} colors={colorConfig} color={this.state.color} />
                        </div>
                    }
                </Col>
                <Col span='12'>
                    <Button onClick={this.handleRemoveBgColor}>移除背景颜色</Button>
                </Col>
            </FormItem>
        </div>
    }
}

SlideProps.propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    addBlock: PropTypes.func,
    getUploadParams: PropTypes.func,
    addBackground: PropTypes.func,
    removeBackground: PropTypes.func,
    removeBgColor: PropTypes.func,
    changeBgColor: PropTypes.func
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUploadParams: () => dispatch(courseEntryActions.uploadGetParams()),
        addBackground: (imgUrl) => {
            dispatch(slideAddBackground(fromJS({
                imgUrl
            })))
        },
        removeBgColor: () => {
            dispatch(slideRemoveBackgroundColor());
        },
        removeBackground: () => {
            dispatch(slideRemoveBackground());
        },
        changeBgColor: (color) => {
            dispatch(slideAddBackgroundColor(Map({
                bgColor: color.hex
            })));
        }
    }
}

export default connect(null, mapDispatchToProps)(SlideProps);
