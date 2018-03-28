/**
 * Created by 万叙杰 on 2017/8/4.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './Navigation.scss';
import {Button, Icon, message, Upload, Modal, Progress, Spin, Menu} from 'antd';
import { Link } from 'react-router-dom';
import * as courseEntryActions from '../../../../actions/courseEntry';
import logo from '../../../../public/images/logo.png';

const Item = Menu.Item;

class Navigation extends Component {
    constructor (props) {
        super(props);
        this.state = {
            MyCourseOrSchoolCourse: [],
            importCourseModalVisible: false,
            showMenu: false,
            url: null,
            confirmLoading: false,
            data: {},
            file: null,
            percent: 0,
            importCourseName: null,
            removeUpload: false,
            importPPTButton: false
        };
    }

    componentWillMount () {
        const {location: {pathname}} = this.props.props;
        switch (pathname) {
        case '/myCourse':
            this.setState({
                MyCourseOrSchoolCourse: ['.$0']
            });
            break;
        case '/schoolCourse':
            this.setState({
                MyCourseOrSchoolCourse: ['.$1']
            });
            break;
        }
    }

    componentWillReceiveProps (nextProps) {
        const {location: {pathname}} = nextProps.props;
        switch (pathname) {
        case '/myCourse':
            this.setState({
                MyCourseOrSchoolCourse: ['.$0']
            });
            break;
        case '/schoolCourse':
            this.setState({
                MyCourseOrSchoolCourse: ['.$1']
            });
            break;
        }
    }

    componentDidUpdate () {
        if (this.state.importCourseModalVisible) {
            window.onbeforeunload = () => {
                return '系统可能不会保存您所做的更改。';
            }
        } else {
            window.onbeforeunload = () => {
                return null;
            }
        }
    }

    showMenu = () => {
        this.setState({
            showMenu: true,
            importPPTButton: true
        })
    }

    hideMenu = () => {
        this.setState({
            showMenu: false
        })
    }

    // 新建课件
    buildCourse = () => {
        const { dispatch } = this.props.props;
        dispatch(courseEntryActions.buildCourseGetId()).then(res => {
            if (res.code === 0) {
                window.location.href = `/ppt/${res.data}`;
            } else {
                message.error(res.message);
            }
        })
    }

    // 获取阿里云配置参数
    uploadPPTGetParams = () => {
        const {dispatch} = this.props.props;
        return dispatch(courseEntryActions.uploadGetParams());
    }

    beforeUpload = (file) => {
        message.destroy();
        const fileName = file.name.toLowerCase().split('.').slice(-1)[0]
        return new Promise((resolve, reject) => {
            this.uploadPPTGetParams().then(res => {
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
                            'x:filename': `${Date.parse(new Date()) + Math.random()}.${fileName}`
                        }
                    }, () => {
                        resolve();
                    });
                }
            }).catch(err => {
                reject(new Error(err));
            })
        })
    }

    handleChange = ({file}) => {
        const {status} = file;
        if (!this.state.removeUpload) {
            if (status === 'uploading') {
                this.setState({
                    percent: file.percent,
                    importCourseName: file.name,
                    importCourseModalVisible: true
                });
            } else if (status === 'done') {
                const {dispatch} = this.props.props;
                this.setState({
                    confirmLoading: true
                })
                !this.state.removeUpload && dispatch(courseEntryActions.importCourse(file.name, file.response.data.fileId)).then(json => {
                    if (json.code === 0) {
                        this.setState({
                            confirmLoading: false,
                            importCourseModalVisible: false,
                            removeUpload: true
                        },
                            () => {
                                message.success(<span>导入成功！<a onClick={() => { message.destroy(); window.open(`/ppt/${json.data}`) }}>点击编辑</a><Icon type='close' style={{marginLeft: '10px', marginRight: 0, cursor: 'pointer'}} onClick={() => message.destroy()} /></span>, 0);
                            })
                    } else {
                        this.setState({
                            percent: 0,
                            importCourseName: null,
                            importCourseModalVisible: false,
                            removeUpload: true
                        });
                    }
                })
            } else if (status === 'error') {
                this.setState({
                    percent: 0,
                    importCourseName: null,
                    importCourseModalVisible: false,
                    removeUpload: true
                });
                message.error('上传课件失败！');
            }
        } else {
            this.setState({
                confirmLoading: false
            })
        }
        this.setState({
            percent: file.percent,
            importCourseName: file.name
        });
    }

    progressCancel = () => {
        this.setState({
            percent: 0,
            importCourseName: null,
            importCourseModalVisible: false,
            removeUpload: true,
            importPPTButton: false
        });
    }

    // 点击导入时，要恢复因点击取消造成的弹出框隐藏的状态
    exportCourse = () => {
        this.setState({
            removeUpload: false
        })
    }

    render () {
        const {url, data, percent, importCourseName} = this.state;
        const props = {
            action: url,
            data: data,
            beforeUpload: this.beforeUpload,
            onChange: this.handleChange,
            showUploadList: false,
            accept: '.ppt, .pptx'
        }
        return (
            <div styleName='navigation' className='navigation'>
                <div className='home-nav'>
                    <div className='ui container home-nav-wrapper'>
                        <div className='logo'>
                            <Link to='/'>
                                <img src={logo} alt='logo' />
                            </Link>
                        </div>
                        <Menu className='navSelectUl' mode='horizontal' selectedKeys={this.state.MyCourseOrSchoolCourse}>
                            <Item key='0'><Link to='/myCourse'>我的课件</Link></Item>
                            <Item key='1'><Link to='/schoolCourse'>校本资源</Link></Item>
                        </Menu>
                        <div className='menuDiv' onMouseEnter={this.showMenu} onMouseLeave={this.hideMenu}>
                            <Button className='newPPTBtn' type='primary' onClick={this.buildCourse}>新建课件<Icon type='down' /></Button>
                            <div className={this.state.showMenu ? 'selectMenu' : 'selectMenu hide'}>
                                <div className='menuButton' onClick={this.buildCourse}>新建空白课件</div>
                                {this.state.importPPTButton && <Upload {...props}>
                                    <div className='menuButton' onClick={this.exportCourse}>
                                        <span>导入PPT</span>
                                    </div>
                                </Upload>}
                            </div>
                        </div>
                    </div>
                    <div id='importCourseModal' />
                </div>
                <Modal
                  visible={this.state.importCourseModalVisible}
                  className='importCourseModal'
                  width='500'
                  maskClosable={false}
                  closable={false}
                  title='导入PPT'
                  getContainer={() => document.getElementById('importCourseModal')}
                  footer={null}
                >
                    <div className='importBody'>
                        <i className='iconfont icon-ppt' />
                        <p className='importBodyTitle'>
                            {
                                `${importCourseName !== null && (importCourseName.length > 40 ? importCourseName.slice(0, 38) + '......' : importCourseName)}`
                            }
                        </p>
                        <Progress percent={parseInt(percent)} status='active' strokeWidth={17} />
                        {this.state.confirmLoading ? <Spin className='progressCancelSpin' /> : <span className='progressCancel' onClick={this.progressCancel}>取消</span>}
                    </div>
                </Modal>
            </div>
        )
    }
}
// {`${importCourseName.slice(0, 38)}......`}
Navigation.propTypes = {
    dispatch: PropTypes.any,
    props: PropTypes.any,
    location: PropTypes.any
}

export default CSSModules(Navigation, style);
