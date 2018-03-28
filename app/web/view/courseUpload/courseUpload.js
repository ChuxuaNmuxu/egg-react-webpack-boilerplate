import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Form, Row, Col, Input, Icon, message, Tooltip } from 'antd';
import KnowledgeMenu from './knowledgeMenu/knowledgeMenu';
import CSSModules from 'react-css-modules';
import styles from './courseUpload.scss';
import { fetchUploadCourse } from '../../actions/course';
const FormItem = Form.Item;
// 限定上传文件类型
const fileType = '.ppt,.pptx,.doc,.docx,.pdf,.png,.jpg,.gif,.jpeg,.bmp,.avi,.wmv,.mkv,.flv,.wma,.rmvb,.rm,.mp4,.3gp,.zip,.rar,.7z';
class CourseUpload extends Component {
    constructor (props) {
        super(props)
        this.state = {
            visible: false,
            selectedKnowledge: [],
            selectedSubject: null,
            selectedKnowledgeErr: false,
            fileName: '',
            fileMax: false,
            maskClosable: false,
            isTitleLong: false
        }
        this.collectKnowledge = this.collectKnowledge.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.courseNameChange = this.courseNameChange.bind(this);
        this.courseDescribeChange = this.courseDescribeChange.bind(this);
        this.courseKeyWordsChange = this.courseKeyWordsChange.bind(this);
        this.fileChange = this.fileChange.bind(this);
    }
    collectKnowledge (a, b) {
        this.setState({
            selectedKnowledge: a,
            selectedSubject: b
        })
        if (a.length && b) {
            this.setState({
                selectedKnowledgeErr: true
            })
        } else {
            this.setState({
                selectedKnowledgeErr: false
            })
        }
    }
    showModal () {
        this.setState({
            visible: true
        });
    }
    fileChange (e) {
        this.setState({
            isTitleLong: false
        });
        let target = document.querySelector('input[type="file"]');
        let isIe = /msie/i.test(navigator.userAgent) && !window.opera;
        let fileSize = 0;
        if (target.files[0]) {
            let fileName = target.files[0].name;
            let len = fileName.length;
            let realLength = 0;
            realLength = fileName.replace(/[\u0391-\uFFE5]/g, 'aa').length;
            if (realLength > 44) {
                this.setState({
                    isTitleLong: true,
                    filePostfix: '...' + fileName.substring(len - 5, len)
                });
            }
            this.setState({
                fileName: fileName
            });
        } else {
            this.setState({
                fileName: ''
            });
        };
        if (isIe && !target.files) {
            var filePath = target.value; // 获得上传文件的绝对路径
            var fileSystem = new window.ActiveXObject('Scripting.FileSystemObject');
            // GetFile(path) 方法从磁盘获取一个文件并返回。
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;    // 文件大小，单位：b
        } else {    // 非IE浏览器
            if (target.files[0]) {
                fileSize = target.files[0].size;
            }
        }
        var size = fileSize / 1024 / 1024;
        if (size > 20) {
            message.error('课件大小不能超过20M，请重新选择课件！', 3);
            this.props.form.setFieldsValue({
                file: null
            });
            target.value = '';
            this.setState({
                fileName: '',
                fileMax: true
            });
        } else {
            this.setState({
                fileMax: false
            })
        }
    }
    handleSubmit (e) {
        let that = this;
        e.preventDefault();
        const { dispatch } = this.props;
        this.props.form.validateFields((err, values) => {
            if (!err && !this.state.fileMax) {
                let selectedKnowledge = '';
                this.state.selectedKnowledge.map(function (data) {
                    selectedKnowledge += data.id + ',';
                })
                let input = document.querySelector('input[type="file"]')
                let uploadFormData = new FormData();
                uploadFormData.append('file', input.files[0]);              // 文件
                uploadFormData.append('name', values.fileName);                // 文件名
                uploadFormData.append('subjectId', that.state.selectedSubject);    // 当前课件所属学科
                uploadFormData.append('knowledgeIds', selectedKnowledge);           // 课件所属知识点ID
                // 课件关键字，非必需
                if (values.keyWords) {
                    values.keyWords = values.keyWords.replace(/，/ig, ',');
                    uploadFormData.append('keywords', values.keyWords);
                };
                // 课件描述，非必需
                if (values.description) {
                    uploadFormData.append('summary', values.description);
                };
                if (that.state.selectedSubject && that.state.selectedKnowledge.length) {
                    dispatch(fetchUploadCourse(uploadFormData, 'file', that.state.selectedSubject, this.props.size));
                    this.setState({
                        visible: false,
                        selectedSubject: null,
                        selectedKnowledge: [],
                        selectedKnowledgeErr: false,
                        fileName: '',
                        isTitleLong: false
                    });
                    this.props.form.setFieldsValue({
                        file: '',
                        fileName: '',
                        description: '',
                        keyWords: ''
                    });
                }
            }
        });
    }
    handleCancel () {
        this.setState({
            visible: false,
            selectedSubject: null,
            selectedKnowledge: [],
            selectedKnowledgeErr: false,
            fileName: '',
            isTitleLong: false
        });
        this.props.form.setFieldsValue({
            file: '',
            fileName: '',
            description: '',
            keyWords: ''
        });
    }
    courseNameChange (e) {
        this.props.form.setFieldsValue({
            fileName: e.target.value
        });
    }
    courseDescribeChange (e) {
        this.props.form.setFieldsValue({
            description: e.target.value
        });
    }
    courseKeyWordsChange (e) {
        this.props.form.setFieldsValue({
            keyWords: e.target.value
        });
    }
    render () {
        const { form: { getFieldDecorator } } = this.props;
        return (
            <div className='courseUpload' styleName='courseUpload'>
                <Button type='primary' onClick={this.showModal} className='uploadBtn'>
                    上传课件
                </Button>
                <Modal
                  styleName='course-modal'
                  visible={this.state.visible}
                  title='上传课件'
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  wrapClassName='course-modal'
                  width='800px'
                  footer={false}
                  maskClosable={this.state.maskClosable}
                >
                    <Form onSubmit={this.handleSubmit} onKeyDown={(event) => event.keyCode === 13 && this.handleSubmit(event)} autoComplete='off'>
                        <div>
                            <Row className='move-t uploadFile'>
                                <Col span={4} htmlFor='upFile'><span className='mandatory'>*</span><span className='modal-key'>文件</span></Col>
                                <Col span={16}>
                                    <FormItem
                                    >
                                        {getFieldDecorator('file', {
                                            rules: [{required: true, message: '请上传课件'}],
                                            onChange: this.fileChange
                                        })(
                                            <input type='file' className='fileInput' accept={fileType} />
                                        )}
                                        <Button type='primary'>
                                            <Icon type='upload' />选择文件
                                        </Button>
                                        <Tooltip title={this.state.fileName} overlayStyle={{wordWrap: 'break-word'}}>
                                            <span className='fileSpan'>{this.state.fileName}</span>
                                            <span className={this.state.isTitleLong ? 'filePostfix' : 'displayNone'}>{this.state.filePostfix}</span>
                                        </Tooltip>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='move-t'>
                                <Col span={4} htmlFor='fileName'><span className='mandatory'>*</span><span className='modal-key'>课件名称</span></Col>
                                <Col span={16}>
                                    <FormItem hasFeedback>
                                        {getFieldDecorator('fileName', {
                                            rules: [
                                                { required: true, message: '请输入课件名称' },
                                                {whitespace: true, message: '名称不能全为空格'},
                                                { rule: 'length', min: 1, max: 100, message: '课件名称长度必须在1-100字之间' }
                                            ],
                                            onChange: this.courseNameChange
                                        })(
                                            <Input placeholder='请输入课件名称' />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='move-t'>
                                <Col span={4} htmlFor='knowledge'><span className='mandatory'>*</span><span className='modal-key'>知识点</span></Col>
                                <Col span={20}>
                                    {this.state.selectedKnowledge.map(function (value, index) {
                                        return <Button key={index} className='selectedKnowledge'>{value.title}</Button>
                                    })}
                                    <KnowledgeMenu collectKnowledge={this.collectKnowledge} visible={this.state.visible} selectedKnowledge={this.state.selectedKnowledge} />
                                    <Col offset={5} className='knowledgeErr'>{this.state.selectedKnowledgeErr ? '' : '请选择知识点！'}</Col>
                                </Col>
                            </Row>
                            <Row className='move-t'>
                                <Col span={4} htmlFor='description'><span className='modal-key move-r'>描述</span></Col>
                                <Col span={16}>
                                    <FormItem>
                                        {getFieldDecorator('description', {
                                            rules: [
                                                { rule: 'length', min: 1, max: 500, message: '课件描述长度必须在1-500字之间' }
                                            ],
                                            onChange: this.courseDescribeChange
                                        })(
                                            <Input placeholder='请输入课件描述' type='textarea' rows={4} />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='move-t'>
                                <Col span={4} htmlFor='keyWords'><span className='modal-key move-r'>关键词</span></Col>
                                <Col span={16}>
                                    <FormItem>
                                        {getFieldDecorator('keyWords', {
                                            rules: [
                                                { rule: 'length', min: 1, max: 100, message: '关键词长度必须在1-100字之间' }
                                            ],
                                            onChange: this.courseKeyWordsChange
                                        })(
                                            <Input placeholder='多个关键词用逗号隔开' type='textarea' rows={2} />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col offset={8} span={4}>
                                    <FormItem>
                                        <Button type='primary' htmlType='submit' size='large'>确定上传</Button>
                                    </FormItem>
                                </Col>
                                <Col offset={1} span={4}><Button onClick={this.handleCancel} size='large'>取消上传</Button></Col>
                            </Row>
                        </div>
                    </Form>
                </Modal>
            </div>
        );
    }
};

const mapstatetoprops = (state) => {
    const { course } = state;
    return {
        size: course.courseData.data.limit
    }
}

CourseUpload.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    size: PropTypes.any
};
export default connect(mapstatetoprops)(Form.create()(CSSModules(CourseUpload, styles)));
