/**
 * 上传图片组件, 基于UploadImage, 封装适用于备课的插入图片组件
 * @see UploadImage
 * @author Ouyang
 * */
import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import UploadImage from '../../UploadImage/index';
import Style from './Image.scss';

class Image extends React.PureComponent {
    static displayName = 'Image';

    static propTypes = {
        // 添加图片信息调用
        addBlock: PropTypes.func,
        // 获取上传参数
        getUploadParams: PropTypes.func,
        // 类名
        className: PropTypes.string
    };

    constructor (props) {
        super(props);
        this.state = {
            modelVisible: false
        };
    }

    handleClick = () => {
        this.setState({
            modelVisible: !this.state.modelVisible
        })
    }

    render () {
        return (
            <div className='image-tool' styleName='image-tool'>
                <div className='image-tool-wrap' onClick={this.handleClick} >
                    <div className='image-icon' data-type='image'>
                        <i className='iconfont icon-tupian' />
                    </div>
                    <div className='image-title' data-type='image'>图片</div>
                    <UploadImage
                      handleVisible={this.handleClick}
                      visible={this.state.modelVisible}
                      addBlock={this.props.addBlock}
                      uploadGetParams={this.props.getUploadParams}
                />
                </div>
            </div>
        );
    }
}

export default CSSModules(Image, Style);
