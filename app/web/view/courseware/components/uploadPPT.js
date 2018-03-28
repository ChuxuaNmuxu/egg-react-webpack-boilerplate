import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Upload, Icon, Message, Button} from 'antd';

const propTypes = {
    judgeType: PropTypes.array,
    uploadPPTGetParams: PropTypes.func,
    controlModalVisible: PropTypes.func,
    modalVisible: PropTypes.bool,
    confirmUploadPPT: PropTypes.func
}

class UploadPPT extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            url: '',
            confirmLoading: false,
            data: {},
            fileList: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
    }

    handleChange = ({ fileList }) => {
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
    }

    beforeUpload (file) {
        const { uploadPPTGetParams } = this.props;
        return new Promise((resolve, reject) => {
            uploadPPTGetParams().then(res => {
                console.log('res', res);
                console.log('file', file);
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
                            'x:filename': file.name
                        }
                    }, () => {
                        resolve();
                    });
                }
            }).catch(err => {
                // console.log(err);
                reject(new Error(err));
            })
        })
    }
    // 导入弹出框的确认
    confirmUploadPPT ({ fileList }) {
        console.log(fileList);
        if (fileList.length === 0) {
            Message.error('请导入文件！');
            return;
        }
        if (fileList[0].status === 'error') {
            Message.error(`导入${fileList[0].name}失败，请重新导入！`);
            return;
        }
        this.props.confirmUploadPPT && this.props.confirmUploadPPT(fileList);
    }

    render () {
        const { modalVisible, controlModalVisible } = this.props;
        const { confirmLoading, url, data } = this.state;
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
            fileList: this.state.fileList,
            showUploadList: true,
            accept: '.ppt, .pptx'
        };
        return (
            <div>
                <Modal
                  styleName='course-modal'
                  visible={modalVisible}
                  confirmLoading={confirmLoading}
                  title='导入PPT'
                  onCancel={() => {
                      controlModalVisible(false);
                  }}
                  onOk={() => {
                      this.confirmUploadPPT(this.state);
                  }}
                  wrapClassName='course-modal'
                >
                    <Upload {...props}>
                        <Button
                          size='large'
                          disabled={this.state.fileList.length > 0}
                        >
                            <Icon type='upload' /> 导入PPT
                        </Button>
                    </Upload>
                </Modal>
            </div>
        );
    }
}

UploadPPT.propTypes = propTypes;

export default UploadPPT;
