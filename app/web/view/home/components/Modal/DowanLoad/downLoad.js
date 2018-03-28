import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import * as Lodash from 'lodash';
import { Modal, Button } from 'antd';
import Styles from './downLoad.scss';
import tipQuestion from '../../../../../public/images/tip-question.png';

/**
 * 下载文件提示框
 * */
class DownLoadDialog extends React.PureComponent {
    static displayName = 'DownLoadDialog';

    static propTypes = {
        content: PropTypes.any,
        visible: PropTypes.bool,
        resource: PropTypes.string,
        size: PropTypes.number,
        width: PropTypes.number,
        getContainer: PropTypes.func,
        onDownLoad: PropTypes.func,
        onCancel: PropTypes.func
    };

    static defaultProps = {
        size: '',
        width: 300,
        onDownLoad: () => null,
        onCancel: () => null
    };

    getDownLoadButtonState = () => {
        const { resource } = this.props;
        return (Lodash.isNull(resource) || Lodash.isUndefined(resource) || resource === '');
    }

    createDownLoadText = () => {
        const { size } = this.props;
        const state = this.getDownLoadButtonState();
        return state ? `打包中` : `下载(${size})`
    }

    createDefaultContent = () => {
        return null;
    }

    createDefaultContainer () {
        return document.getElementById('download-component');
    }

    render () {
        const {
          width,
          getContainer,
          visible,
          onDownLoad,
          onCancel
        } = this.props;
        const containerProps = {
            styleName: 'download-component',
            className: 'download-component',
            id: 'download-component'
        };
        return (
            <div {...containerProps}>
                <Modal
                  visible={visible}
                  className='downLoadCourseWareModal'
                  width={width}
                  maskClosable={false}
                  closable={false}
                  getContainer={getContainer || this.createDefaultContainer}
                  footer={[
                      <Button
                        className='downLoadResource'
                        onClick={(e) => onDownLoad({event: e, props: this.props})}
                        key='downLoad'
                        size='large'
                        loading={this.getDownLoadButtonState()}
                      >{this.createDownLoadText()}</Button>,
                      <Button
                        className='downLoadCancel'
                        onClick={onCancel}
                        key='cancel'
                        size='large'
                      >取消</Button>
                  ]}
                >
                    <img src={tipQuestion} />
                    <h3>着急使用？</h3>
                    <p>您可以下载文件后，拷贝到教室电脑，用E采播控软件打开后即可使用。</p>
                </Modal>
            </div>
        );
    }
}

export default CSSModules(DownLoadDialog, Styles);
