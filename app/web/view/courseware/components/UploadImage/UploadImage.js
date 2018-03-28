import React from 'react';
import PropTypes from 'prop-types';
import {
    Modal, Upload, Icon, Message
} from 'antd';
import CSSModules from 'react-css-modules';
import styles from './UploadImage.scss';

const propTypes = {
    // 控制这个组件的modal显示隐藏： 显示 = true 、隐藏 = false
    modalVisible: PropTypes.bool,
    // 控制上传的格式，传入格式为 Array('string')
    judgeType: PropTypes.array,
    // 上传前请求oss获取参数的操作，后续看能否优化为不传（因为oss的这两个API为固定的）
    uploadGetParams: PropTypes.func,
    // 点击弹出框确定按钮后的操作
    confirmUpload: PropTypes.func,
    // 点击弹出框取消按钮后的操作
    cancelUpload: PropTypes.func,
    addBlock: PropTypes.func,
    handleVisible: PropTypes.func,
    visible: PropTypes.bool
}

const defaultProps = {
    judgeType: ['bmp', 'jpg', 'png', 'tiff', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF']
    // cancelUpload: () => {}
}

class UploadImage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            previewVisible: false,
            previewImage: '',
            confirmLoading: false,
            url: '',
            data: {},
            fileList: []
            // fileList: [
            //     // {
            //     // uid: -1,
            //     // name: 'xxx.png',
            //     // status: 'done',
            //     // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            //     // }
            // ]
        };
        this.handleChange = this.handleChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.handleInit = this.handleInit.bind(this);
    }

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }

    handleChange = ({ fileList }) => {
        // console.log('handleChange的fileList', fileList);
        if (fileList[0]) {
            const { status } = fileList[0];
            if (status === 'uploading') {
                this.setState({
                    confirmLoading: true
                });
            } else if (status === 'done') {
                this.setState({
                    confirmLoading: false
                });
            } else if (status === 'error') {
                fileList[0].response = '上传失败！'
                this.setState({
                    confirmLoading: false
                });
            }
        }
        this.setState({ fileList });
    };

    beforeUpload (file) {
        // console.log('beforeUpload', file);
        const { judgeType, uploadGetParams } = this.props;
        if (!uploadGetParams) {
            Message.error(`没有传入uploadGetParams函数，函数参考为：api.post(config.apiResolve('current', '/api/oss-upload-parameters'))`, 5);
        }
        let jugde = false;
        // let tip = '';
        // for (let i = 0; i < judgeType.length; i++) {
        //     tip += judgeType[i] + '  ';
        //     if (file.name.toLowerCase().split('.')[1].indexOf(judgeType[i].toLowerCase()) >= 0) {
        //         jugde = true;
        //     }
        // }
        // let jugde = file.name.split('.')[1].indexOf('ppt') >= 0 || file.name.split('.')[1].indexOf('pptx') >= 0;
        // console.log(jugde);
        const fileName = file.name.toLowerCase().split('.').slice(-1)[0];
        jugde = judgeType.indexOf(fileName) > -1;
        if (!jugde) {
            Message.error('上传的文件类型错误');
            return jugde;
        }
        return new Promise((resolve, reject) => {
            uploadGetParams().then(res => {
                // console.log(res);
                if (res.code === 0) {
                    this.setState({
                        url: res.data.uploadUrl,
                        data: {
                            key: res.data.objectKey,
                            OSSAccessKeyId: res.data.accessId,
                            callback: res.data.callback,
                            signature: res.data.signature,
                            success_action_status: 200,
                            policy: res.data.policy,
                            // 'x:filename': encodeURIComponent(file.name)
                            // 'x:filename': file.name
                            'x:filename': `${new Date().getTime()}.${fileName}`
                        }
                    }, () => {
                        console.log('请求的参数为:', this.state.data);
                        resolve();
                    });
                }
            }).catch(err => {
                console.log(err);
                reject(new Error(err));
            })
        })
    }

    // 导入弹出框的确认
    confirmUpload ({ fileList }) {
        if (fileList.length === 0) {
            Message.error('请导入文件！');
            return;
        }
        if (fileList[0].status === 'error') {
            Message.error(`导入${fileList[0].name}失败，请重新导入！`);
            return;
        }
        const {addBlock} = this.props;
        // const { courseId } = this.state;
        const {url} = fileList[0].response.data;
        let img = new Image();
        // img.src = file.thumbUrl;
        img.src = url;
        img.onload = (e) => {
            addBlock(e.target.width, e.target.height, url)
        }
        this.handleInit();
    }

    handleInit () {
        const {handleVisible} = this.props;
        this.setState({
            previewVisible: false,
            previewImage: '',
            confirmLoading: false,
            url: '',
            data: {},
            fileList: []
        })
        handleVisible();
    }

    render () {
        const { visible } = this.props;
        const { previewVisible, previewImage, fileList, confirmLoading, url, data } = this.state;
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className='ant-upload-text'>请上传图片</div>
            </div>
        );
        const props = {
            // name: 'x:filename',
            action: url,
            data: data,
            // accept: 'application/vnd.ms-powerpoint',
            // headers: {
                // authorization: 'authorization-text'
            // },
            beforeUpload: this.beforeUpload,
            onChange: this.handleChange,
            fileList: fileList,
            showUploadList: true,
            listType: 'picture-card',
            onPreview: this.handlePreview
        };
        return (
            <div>
                <Modal
                  styleName='course-modal'
                  visible={visible}
                  confirmLoading={confirmLoading}
                  title='上传图片'
                  onCancel={this.handleInit}
                  onOk={() => {
                      this.confirmUpload(this.state);
                  }}
                  wrapClassName='course-modal'
                  // width='150px'
                  // footer={false}
                  // maskClosable={this.state.maskClosable}
                >
                    <div className='clearfix'>
                        {
                            visible
                            ? <Upload {...props}>
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload> : null

                        }
                        <Modal
                          visible={previewVisible}
                          footer={null}
                          onCancel={this.handleCancel}
                        >
                            <img
                              alt='example'
                              style={{ width: '100%' }}
                              src={previewImage}
                            />
                        </Modal>
                    </div>
                </Modal>
            </div>
        );
    }
}

UploadImage.propTypes = propTypes;
UploadImage.defaultProps = defaultProps;

export default CSSModules(UploadImage, styles);
