import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, message} from 'antd';
import CSSModules from 'react-css-modules';
import {compact} from 'lodash';
import domtoimage from 'dom-to-image';
import {fromJS, Map} from 'immutable';
import uuid from 'uuid';

import {cancelCrop, complateCrop, getOssParamsBatch, imagesLoaded} from '../../../../actions/courseware';
import {getTheBlock} from '../../../../reducers/courseware/helper'
import {imgScaleRadio} from '../../../../reducers/courseware/baseBlock'
import {SLIDE_HEIGHT, SLIDE_WIDTH} from '../../config/constant'
import CropSelector from './CropSelector';
import styles from './crop.scss';
import utils from '../../../../utils/utils';

class Crop extends Component {
    constructor (props) {
        super(props);
        const {courseware} = props;
        const imgBlock = getTheBlock(courseware);
        const width = imgBlock.getIn(['props', 'size', 'width']);
        const height = imgBlock.getIn(['props', 'size', 'height']);
        const left = imgBlock.getIn(['props', 'position', 'left']);
        const top = imgBlock.getIn(['props', 'position', 'top']);
        const initWidth = imgBlock.get('initWidth') || width;
        const initHeight = imgBlock.get('initHeight') || height;
        const blockId = imgBlock.get('id');

        // 如果图片尺寸过大，显示时在等比缩放一次，显示尺寸在卡片尺寸之内
        let scale = 1;
        if (width > SLIDE_WIDTH || height > SLIDE_HEIGHT) {
            scale = imgScaleRadio(Map({
                width: width,
                height: height
            }))
        }

        let widthScale = width / initWidth * scale;
        let heightScale = height / initHeight * scale;

        this.state = {
            index: 0,
            cropSelectors: [],
            isAddSelector: false,
            isResizing: false,
            isDraging: false,
            src: imgBlock.get('url'),
            width,
            left,
            top,
            height: imgBlock.getIn(['props', 'size', 'height']),
            blockIndex: courseware.getIn(['current', 'blocks', 0, 'index']),
            widthScale,
            heightScale,
            scale: scale,
            blockId
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleComplete = this.handleComplete.bind(this);
        this.createImageFragments = this.createImageFragments.bind(this);
        this.crop = this.crop.bind(this);
    }

    handleMouseDown (e) {
        e.stopPropagation();
        if (e.target.tagName.toLowerCase() !== 'img') { return }
        const newSelector = {
            height: 0,
            width: 0,
            left: e.pageX,
            top: e.pageY
        };
        this.setState({
            isAddSelector: true,
            index: this.state.cropSelectors.length,
            initPageX: e.pageX,
            initPageY: e.pageY,
            cropSelectors: [...this.state.cropSelectors, newSelector]
        })
    }

    handleMouseMove (e) {
        e.stopPropagation();
        e.preventDefault();
        if (!e.target.dataset.hasOwnProperty('select')) { return }
        const cropSelectors = [...this.state.cropSelectors];
        const cropSelector = cropSelectors[this.state.index];
        const moveX = e.pageX - this.state.initPageX;
        const moveY = e.pageY - this.state.initPageY;
        const {initHeight, initLeft, initWidth, initTop} = this.state;
        if (this.state.isAddSelector) {
            const {initPageX, initPageY, index} = this.state;
            const left = Math.min(e.pageX, initPageX);
            const top = Math.min(e.pageY, initPageY);
            const width = Math.abs(e.pageX - initPageX);
            const height = Math.abs(e.pageY - initPageY);
            cropSelectors.splice(index, 1, {
                left,
                top,
                width,
                height
            });
        } else if (this.state.isDraging) {
            cropSelector.left = initLeft + moveX;
            cropSelector.top = initTop + moveY;

            const {top, left, width, height} = document.querySelector('.cropImg').getBoundingClientRect();
            if (cropSelector.left - left < 0) {
                cropSelector.left = left;
            } else if (cropSelector.left + cropSelector.width - left - width > 0) {
                cropSelector.left = left + width - cropSelector.width;
            }

            if (cropSelector.top - top < 0) {
                cropSelector.top = top;
            } else if (cropSelector.top + cropSelector.height - top - height > 0) {
                cropSelector.top = top + height - cropSelector.height;
            }
        } else if (this.state.isResizing) {
            switch (this.state.direction) {
            case 'n':
                if (initHeight - moveY > 0) {
                    cropSelector.height = initHeight - moveY;
                    cropSelector.top = initTop + moveY;
                }
                break;
            case 's':
                if (initHeight + moveY > 0) {
                    cropSelector.height = initHeight + moveY;
                }
                break;
            case 'e':
                if (initWidth + moveX > 0) {
                    cropSelector.width = initWidth + moveX;
                }
                break;
            case 'w':
                if (initWidth - moveX > 0) {
                    cropSelector.width = initWidth - moveX;
                    cropSelector.left = initLeft + moveX;
                }
                break;
            default:
                break;
            }
        }
        this.setState({
            cropSelectors
        })
    }

    handleMouseUp () {
        this.setState({
            isAddSelector: false,
            isDraging: false,
            isResizing: false
        })
    }

    handleMove (index, e) {
        e.stopPropagation();
        const cropSelectors = [...this.state.cropSelectors];
        const cropSelector = cropSelectors[index];
        const {direction} = e.target.dataset;
        if (direction) {
            this.setState({
                isResizing: true,
                index,
                direction
            })
        } else {
            this.setState({
                isDraging: true,
                index
            })
        }
        this.setState({
            initLeft: cropSelector.left,
            initTop: cropSelector.top,
            initWidth: cropSelector.width,
            initHeight: cropSelector.height,
            initPageX: e.pageX,
            initPageY: e.pageY
        })
    }

    createImageFragments (toQuestion) {
        const url = `url(${this.state.src})`;
        return domtoimage.impl.inliner.inlineAll(url.replace('http://', 'https://')) // 将图片下载到本地，plus: ajax + new FileReader()
            .then(this.createImage)
            .then(img => ({img, toQuestion}))
            .then(this.crop)
    }

    // 从插件获取的url（）中获取src并生成img
    createImage (url) {
        let img = new Image();
        const reg = /^url\(['"]?([^'"]+?)['"]?\)$/;
        const imgSrc = url.match(reg)[1];
        img.src = imgSrc;
        return img;
    }

    // 裁剪图片，返回一个promise
    crop (data) {
        // 裁剪的尺寸
        console.log(89, data)
        const {img, toQuestion} = data;
        const {dispatch} = this.props;
        const {top, left} = document.querySelector('.cropImg').getBoundingClientRect();
        let imgCropSize = this.state.cropSelectors.map((selector) => {
            if (selector.width > 3 && selector.height > 3) {
                const cropLeft = selector.left - left;
                const cropTop = selector.top - top;
                return {
                    cropLeft,
                    cropTop,
                    cropWidth: selector.width,
                    cropHeight: selector.height
                }
            }
        })
        imgCropSize = compact(imgCropSize);

        if (imgCropSize.length < 1) { // 没有选择裁剪区域给出提示
            return null;
        }

        // 生成一个新的promise，传递被裁剪的图片地址和尺寸，为了防止失真，以原始图片裁剪
        const {left: imgBlockLeft, top: imgBlockTop, widthScale, heightScale} = this.state;

        const originSize = imgCropSize.map(size => {
            const cropLeft = size.cropLeft / widthScale;
            const cropWidth = size.cropWidth / widthScale;
            const cropTop = size.cropTop / heightScale;
            const cropHeight = size.cropHeight / heightScale;

            return {
                blockId: `block-${uuid.v4()}`,
                width: cropWidth, // 图片的宽高和剪切尺寸宽高相同
                height: cropHeight,
                cropLeft, // 裁剪的位置
                cropTop,
                left: imgBlockLeft + size.cropLeft, // 图片在卡片上的位置
                top: imgBlockTop + size.cropTop
            }
        })

        // 生成加载中图片元素
        dispatch(complateCrop(Map({
            imgFragments: fromJS(originSize), // 裁剪后的原始图片尺寸
            toQuestion,
            scaleRadio: Map({
                widthScale: this.state.widthScale,
                heightScale: this.state.heightScale
            })
        })))
        return new Promise((resolve, reject) => {
            img.onload = function () {
                dispatch(getOssParamsBatch(originSize.length)).then(res => {
                    if (res.code !== 0) {
                        reject(new Error(res.error))
                    }
                    const {data} = res;
                    return Promise.all(originSize.map((size, index) => { // 批量裁剪图片
                    // 裁剪尺寸换算成相对于原始图片大小
                        // const cropLeft = size.cropLeft / widthScale;
                        // const cropWidth = size.cropWidth / widthScale;
                        // const cropTop = size.cropTop / heightScale;
                        // const cropHeight = size.cropHeight / heightScale;
                        const {width, height, cropLeft: left, cropTop: top, blockId} = size; // 裁剪的位置大小

                        const canvas = document.createElement('canvas');
                        const cxt = canvas.getContext('2d');
                        canvas.width = width;
                        canvas.height = height;
                        cxt.drawImage(img, left, top, width, height, 0, 0, width, height)

                        return Promise.resolve(data) // 请求阿里云参数
                        .then(res => {
                            const data = res[index];
                            const uploadData = {
                                key: data.objectKey,
                                OSSAccessKeyId: data.accessId,
                                callback: data.callback,
                                signature: data.signature,
                                success_action_status: 200,
                                policy: data.policy,
                                'x:filename': `1.png`
                            }
                            return utils.uploadImgToAli(data.uploadUrl, canvas, uploadData); // 图片上传至阿里云
                        })
                        .then(data => {
                            return {
                                imgUrl: data.url,
                                blockId
                            }
                        })
                        .catch(error => {
                            throw new Error(error)
                        })
                    }))
                .then(resolve)// 所有图片上传至阿里云之后promise resolve
                }
            )
            }
        })
        .catch(error => {
            throw new Error(error)
        })
    }

    // 点击完成按钮,toQuestion为true：转成习题
    handleComplete (toQuestion) {
        const {dispatch} = this.props;
        this.createImageFragments(toQuestion).then(imgFragments => {
            if (!imgFragments) {
                message.info('您还没有选择裁剪区域或选择的裁剪区域过小');
                return {};
            }
            dispatch(imagesLoaded(Map({
                imgFragments: fromJS(imgFragments) // 裁剪后的原始图片尺寸
            })))
        })
    }

    handleDelete (index) {
        const cropSelectors = [...this.state.cropSelectors];
        cropSelectors.splice(index, 1);
        this.setState({
            cropSelectors
        })
    }

    handleCancel (e) {
        const {dispatch} = this.props;
        dispatch(cancelCrop());
        this.setState({
            isAddSelector: false,
            index: 0,
            cropSelectors: []
        })
    }

    render () {
        const {width, height, scale} = this.state;
        return <div styleName='cropWrap' className='cropWrap' onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
            <i className='placeHolder ilb' />
            <div className='imgBtnWrap ilb'>
                <img className='cropImg ilb' src={this.state.src} alt='crop' data-select style={{width: width * scale, height: height * scale}} />
                <div className='cropMenu ilb'>
                    <Button.Group>
                        <Button onMouseDown={() => { this.handleComplete() }}>完成</Button>
                        <Button onClick={() => { this.handleComplete(true) }}>转换成题目</Button>
                        <Button onClick={this.handleCancel}>取消</Button>
                    </Button.Group>
                </div>
            </div>
            <div className='imgWrap'>
                {
                    this.state.cropSelectors.map((selector, index) => <CropSelector key={index} selectorProps={selector} handleDelete={this.handleDelete} index={index} handleMove={this.handleMove} />)
                }
            </div>
        </div>
    }
}

Crop.propTypes = {
    dispatch: PropTypes.func,
    courseware: PropTypes.object
}

export default CSSModules(Crop, styles);
