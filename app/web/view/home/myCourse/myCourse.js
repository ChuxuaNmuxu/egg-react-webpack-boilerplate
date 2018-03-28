import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import style from './myCourse.scss';
import {Row, Col, Pagination, Modal, Button, message, Input, Select} from 'antd';
import CoursewareList from '../../courseware/components/CoursewareList/index';
import NoData from '../../courseware/components/noData/index';
import banner from '../../../public/images/banner.png';
import tipQuestion from '../../../public/images/tip-question.png';
import tipAlsoBig from '../../../public/images/tip-also-big.png';
import tipAlso from '../../../public/images/tip-also.png';
import { merge, trim, isEmpty, filter } from 'lodash';
import moment from 'moment';
import * as actions from '../../../actions/courseEntry';
import * as yunActions from '../../../actions/yunBasic';
import PPTfolderSearch from '../../courseware/components/pptfolder/pptfolderSearch/pptfolderSearch';
import Folder from '../../courseware/components/pptfolder/MypptFolder/MypptFolder';
import TextUtils from '../../../utils/textUtils';
import * as Thunk from '../../../thunk/courseWare';
import DownLoad from '../components/Modal/DowanLoad';
const Option = Select.Option;

const mapDownLoadStateToProps = (store) => {
    const {
      courseEntry: {
        myCourse: {
          downLoadModal: {
            resource,
            size,
            visible
          }
        }
      }
    } = store;
    return {
        resource: resource,
        size: TextUtils.byteToSize(size),
        visible: visible
    };
}

const mapDownLoadDispatchToProps = (dispatch, ownProps) => {
    return {
        onCancel: () => dispatch(Thunk.closeDownLoadModal()),
        onDownLoad: ({props}) => dispatch(Thunk.downLoadResource(props.resource))
    };
}

/**
 * 下载文件提示状态Dialog组件
 * */
const DownLoadModal = connect(mapDownLoadStateToProps, mapDownLoadDispatchToProps)(DownLoad);

/**
 * 用户课件页面业务逻辑组件, 包含以下组件
 * 文件夹列表组件
 * 课件列表组件
 * 若干Dialog(下载/删除/同步/分享)
 * */
class MyCourse extends Component {
    static propTypes = {
        dispatch: PropTypes.any,
        list: PropTypes.any,
        searchValue: PropTypes.any,
        myFolderData: PropTypes.any,
        location: PropTypes.object,
        visitor: PropTypes.object
    };

    constructor (props) {
        super(props);
        this.state = {
            MyCourseOrSchoolCourse: 0,
            pagination: {
                total: null,
                page: 1,
                pageSize: 10,
                totalPage: null
            },
            data: [],
            downloadCourseModalVisible: false,
            downloadCourseUrl: null,
            downloadCourseSize: null,
            deleteCourseModalVisible: false,
            CourseId: null,       // 当前操作的课件id
            courseName: null,            // 分享课件编辑课件信息时传入课件名,
            editCourseModalVisible: false,
            shareCourseInfo: {
                name: null,
                subjectIds: [],
                gradeIds: [],
                summary: null
            },
            nameLength: 0,
            summaryLength: 0,
            folderId: null,
            keyword: null,
            selectedKeys: ['.$0'],
            allSubjects: [],
            allGrades: []
        };
        this.folderSwitch = this.folderSwitch.bind(this);
        this.searchInputClick = this.searchInputClick.bind(this);
    }

    componentWillMount () {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
    }

    componentDidMount () {
        window.history.pushState(null, null, 'myCourse')
    }

    componentWillReceiveProps (nextProps) {
        const {list} = nextProps;
        this.setState({
            pagination: {
                page: list.page,
                pageSize: list.pageSize,
                total: list.total,
                totalPage: list.totalPages
            },
            data: list.data
        })
    }

    // 数组出去'.$'
    formatArray = (array) => {
        for (let i = 0; i < array.length; i++) {
            array[i] = array[i].substr(2, array[i].length);
        }
        return array;
    }

    // 字节转换
    bytesToSize = (bytes) => {
        if (bytes === 0) return '0 B';
        let k = 1024;
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i];
    }

    /**
     * 刷新课件列表(核心方法)
     * @param page      页码
     * @param pageSize  数量
     * @param folderId  所属文件夹ID
     * @param keyword   搜索关键字
     * */
    reFetchList = (page = this.state.pagination.page, pageSize = this.state.pagination.pageSize, folderId = this.state.folderId, keyword = this.state.keyword) => {
        const {dispatch} = this.props;
        dispatch(actions.fetchCourseList(page, pageSize, folderId, keyword));
    }

    // 文件夹切换
    folderSwitch (folderId, selectedKeys) {
        const { dispatch } = this.props;
        this.setState({
            folderId: folderId,
            selectedKeys: selectedKeys,
            keyword: null
        }, () => {
            this.reFetchList(1, 10, this.state.folderId, '')
            dispatch({
                type: 'SAVE_SEARCH_VALUE',
                data: ''
            })
        })
    }

    // 搜索框点击事件
    searchInputClick (value) {
        const { dispatch } = this.props;
        this.setState({
            keyword: value,
            selectedKeys: [],
            folderId: null
        }, () => {
            this.reFetchList(1, 10, this.state.folderId, this.state.keyword)
            dispatch({
                type: 'SAVE_SEARCH_VALUE',
                data: value
            })
        })
    }

    // 同步课件
    synchronization = (id) => {
        const {dispatch} = this.props;
        const {data} = this.state;
        dispatch(actions.synchronizationCourse(id)).then(json => {
            if (json.code === 0) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === id) {
                        data[i].syncStatus = 1;
                        data[i].syncEta = moment(json.data.eta).format('MM/DD  HH:mm')
                        break;
                    }
                }
                this.setState({
                    data
                })
            }
        })
    }

    // 课件信息名称
    courseNameChange = (e) => {
        const value = trim(e.target.value) || null;
        const {subjectIds, gradeIds, summary} = this.state.shareCourseInfo;
        this.setState({
            shareCourseInfo: {
                name: value,
                subjectIds,
                gradeIds,
                summary
            },
            nameLength: value.length
        })
    }

    // 课件信息学科修改
    subjectsHandleChange = (value) => {
        const {name, gradeIds, summary} = this.state.shareCourseInfo;
        this.setState({
            shareCourseInfo: {
                name,
                subjectIds: value,
                gradeIds,
                summary
            }
        })
    }

    // 课件信息年级修改
    gradesHandleChange = (value) => {
        const {name, subjectIds, summary} = this.state.shareCourseInfo;
        this.setState({
            shareCourseInfo: {
                name,
                subjectIds,
                gradeIds: value,
                summary
            }
        })
    }

    // 课件描述修改
    courseDescribeChange = (e) => {
        const value = trim(e.target.value) || null;
        const {name, subjectIds, gradeIds} = this.state.shareCourseInfo;
        this.setState({
            shareCourseInfo: {
                name,
                subjectIds,
                gradeIds,
                summary: value
            },
            summaryLength: value.length
        })
    }

    // 打开下载课件modal
    downloadCourseModal = (DownloadResult) => {
        this.setState({
            downloadCourseModalVisible: true,
            downloadCourseUrl: DownloadResult.url,
            downloadCourseSize: this.bytesToSize(DownloadResult.size)
        })
    }

    // 下载课件, 并关闭下载modal
    downloadCourse = () => {
        window.location.href = this.state.downloadCourseUrl;
        this.setState({
            downloadCourseModalVisible: false
        })
    }

    // 分享操作
    shareCourse = (id, bol, name) => {
        const {dispatch, visitor} = this.props;
        const {data} = this.state;
        dispatch(actions.shareCourse(id, !bol)).then(json => {
            if (json.code === 0) {
                // for (let i = 0; i < data.length; i++) {
                //     if (data[i].id === id) {
                //         data[i].shared = !data[i].shared;
                //         break;
                //     }
                // }
                const currentItem = data.filter(item => item.id === id)[0];
                currentItem.shared = !currentItem.shared;
                this.setState({
                    data
                })
                if (!bol) {
                    message.destroy();
                    message.success('分享成功', 3);
                } else {
                    message.destroy();
                    message.success('取消分享成功', 3);
                }
            } else if (json.code === 31902) {
                isEmpty(this.state.allSubjects) && dispatch(yunActions.fetchAllSubject(visitor.schoolId[0])).then(json => {
                    if (json.code === 0) {
                        this.setState({
                            allSubjects: json.data
                        })
                    } else {
                        message.error('获取学科信息失败！')
                    }
                })
                isEmpty(this.state.allSubjects) && dispatch(yunActions.fetchAllGrade(visitor.schoolId[0])).then(json => {
                    if (json.code === 0) {
                        this.setState({
                            allGrades: json.data.rows
                        })
                    } else {
                        message.error('获取年级信息失败！')
                    }
                })
                dispatch(actions.shareGetInfo(id)).then(json => {
                    if (json.code === 0) {
                        this.setState({
                            // 打开课件编辑modal
                            editCourseModalVisible: true,
                            CourseId: id,
                            shareCourseInfo: {
                                name: name,
                                subjectIds: json.data.subjectIdList,
                                gradeIds: json.data.gradeIdList,
                                summary: json.data.summary
                            },
                            nameLength: name.length,
                            summaryLength: 0
                        })
                    }
                });
            } else {
                message.error('请求失败！')
            }
        })
    }

    // 关闭下课课件modal
    downloadCourseModalCancel = () => {
        this.setState({
            downloadCourseModalVisible: false,
            downloadCourseUrl: null
        })
    }

    // 打开删除课件modal
    deleteCourseModal = (id) => {
        this.setState({
            deleteCourseModalVisible: true,
            CourseId: id
        })
    }

    // 删除课件
    deleteCourse = () => {
        const {dispatch} = this.props;
        dispatch(actions.deleteCourse(this.state.CourseId)).then(json => {
            if (json.code === 0) {
                message.success('删除成功');
                this.reFetchList();
                this.deleteCourseModalCancel();
            } else {
                message.error(`删除失败：${json.message}`);
            }
        })
    }

    // 关闭删除课件modal
    deleteCourseModalCancel = () => {
        this.setState({
            deleteCourseModalVisible: false,
            CourseId: null
        })
    }

    submitCourseEdit = () => {
        const {data, shareCourseInfo: {name, subjectIds, gradeIds, summary}} = this.state;
        const {dispatch} = this.props;
        if (!name) {
            message.error('请输入课件名称！');
        } else if (isEmpty(subjectIds)) {
            message.error('请输入该课件适用的学科！');
        } else if (isEmpty(gradeIds)) {
            message.error('请输入该课件适用的年级！');
        } else if (!summary) {
            message.error('请输入课件描述！');
        } else {
            dispatch(actions.saveCourseInfo(this.state.CourseId, name, subjectIds, gradeIds, summary)).then(json => {
                if (json.code === 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === this.state.CourseId) {
                            data[i].summary = summary;
                            break;
                        }
                    }
                    this.setState({
                        editCourseModalVisible: false,
                        data
                    })
                    this.shareCourse(this.state.CourseId, false, name);
                } else {
                    message.error(`课件信息保存失败！${json.message}`);
                }
            })
        }
    }

    // 关闭编辑课件信息modal
    editCourseModalCancel = () => {
        this.setState({
            editCourseModalVisible: false
        })
    }

    // 点击菜单栏
    menuClick = (key, info) => {
        const {dispatch} = this.props;
        if (key === 'download') {
            // window.location.href = info;
            dispatch(Thunk.handleCourseWareResource(info));
        } else if (key === 'delete') {
            this.deleteCourseModal(info);
        } else {
            dispatch(actions.moveCourse(key, info)).then(json => {
                if (json.code === 0) {
                    this.reFetchList();
                }
            })
        }
    }

    // 分页页码变化
    handlePageChange = (page) => {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        this.setState(merge(this.state, {
            pagination: {
                page
            }
        }), () => this.reFetchList(page, this.state.pagination.pageSize));
    }

    jumpPage = (page) => {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        if (this.state.pagination.page !== page) {
            this.setState(merge(this.state, {
                pagination: {
                    page
                }
            }), () => this.reFetchList(page, this.state.pagination.pageSize));
        }
    }

    render () {
        return (
            <div styleName='myCourse' className='myCourse'>
                <div className='myCourseware'>
                    <div className='banner-image'>
                        <img src={banner} style={{width: '100%'}} />
                    </div>
                    <div className='ui container content'>
                        <Row gutter={30}>
                            <Col span={6} className='leftSelect' style={{paddingLeft: 0, paddingRight: 0}}>
                                <PPTfolderSearch searchInputClick={this.searchInputClick} />
                                <Folder folderSwitch={this.folderSwitch} selectedKeys={this.state.selectedKeys} location={this.props.location} />
                            </Col>
                            <Col span={18} className='rightList'>
                                {this.props.searchValue ? <p className='searchContent'>搜索<span className='searchKeyWord'>"{this.props.searchValue}"</span>共搜到<span className='searchKeyWord'>{this.state.pagination.total}</span>份文件</p> : null}
                                {this.state.data.length ? this.state.data.map((item, index) => {
                                    const myFolderData = filter(this.props.myFolderData, (n) => {
                                        return n.id.toString() !== item.folderId.toString();
                                    })
                                    return (
                                        <CoursewareList
                                          MyCourseOrSchoolCourse={0}
                                          key={index} item={item}
                                          props={this.props}
                                          downloadCourseModal={(DownloadResult) => this.downloadCourseModal(DownloadResult)}
                                          deleteCourseModal={(id) => this.deleteCourseModal(id)}
                                          menuClick={(key, info) => this.menuClick(key, info)}
                                          shareCourse={(id, bol, name) => this.shareCourse(id, bol, name)}
                                          synchronization={(id) => this.synchronization(id)} myFolderData={myFolderData}
                                        />
                                    )
                                }) : this.props.searchValue ? null : <NoData MyCourseOrSchoolCourse={0} />}
                                {
                                 this.state.pagination.total > 10 && <div className='pagination'>
                                     <div className='homepage' onClick={() => this.jumpPage(1)}>首页</div>
                                     <Pagination
                                       total={parseInt(this.state.pagination.total)}
                                       pageSize={this.state.pagination.pageSize}
                                       current={this.state.pagination.page}
                                       defaultCurrent={1}
                                       onChange={this.handlePageChange}
                                 />
                                     <div className='endpage' onClick={() => this.jumpPage(this.state.pagination.totalPage)}>尾页</div>
                                 </div>
                                 }
                            </Col>
                        </Row>
                    </div>
                    <div id='downloadCourseModal' />
                    <div id='deleteCourseModal' />
                    <div id='editCourseModal' />
                </div>
                <DownLoadModal
                  width={300}
                />
                <Modal
                  visible={this.state.downloadCourseModalVisible}
                  className='downloadCourseModal'
                  width='300'
                  maskClosable={false}
                  closable={false}
                  getContainer={() => document.getElementById('downloadCourseModal')}
                  footer={[
                      <Button className='downloadCourse' onClick={this.downloadCourse} key='down' size='large'>下载({this.state.downloadCourseSize})</Button>,
                      <Button className='downloadCancel' onClick={this.downloadCourseModalCancel} key='close' size='large'>取消</Button>
                  ]}
                >
                    <img src={tipQuestion} />
                    <h3>着急使用？</h3>
                    <p>您可以下载文件后，拷贝到教室电脑，用E采播控软件打开后即可使用。</p>
                </Modal>
                <Modal
                  visible={this.state.deleteCourseModalVisible}
                  className='deleteCourseModal'
                  width='300'
                  maskClosable={false}
                  closable={false}
                  getContainer={() => document.getElementById('deleteCourseModal')}
                  footer={[
                      <Button className='deleteCourse' onClick={this.deleteCourse} key='down' size='large'>确认</Button>,
                      <Button className='deleteCancel' onClick={this.deleteCourseModalCancel} key='close' size='large'>取消</Button>
                  ]}
                >
                    <img src={tipAlsoBig} />
                    <p>您确定要删除此课件吗？</p>
                    <p>课件删除后不可恢复</p>
                </Modal>
                <Modal
                  visible={this.state.editCourseModalVisible}
                  className='editCourseModal'
                  width='500'
                  title='课件信息'
                  maskClosable={false}
                  getContainer={() => document.getElementById('editCourseModal')}
                  onCancel={this.editCourseModalCancel}
                  footer={[
                      <Button className='shareCourse' onClick={this.submitCourseEdit} key='down' size='large'>保存</Button>,
                      <Button className='shareCancel' onClick={this.editCourseModalCancel} key='close' size='large'>取消</Button>
                  ]}
                >
                    <p className='contentTitle'><img src={tipAlso} /><span>请先完善以下信息！</span></p>
                    <p className='courseNameTitle'>课件名称</p>
                    <Input className='courseName' value={this.state.shareCourseInfo.name} onChange={this.courseNameChange} placeholder='请输入课件名称' maxLength={20} suffix={<span className={this.state.nameLength === 20 ? 'warnTip' : null}>{this.state.nameLength}/20</span>} />
                    <p className='courseSubjectTitle'>适用学科<span>(可多选)</span></p>
                    <Select
                      className='courseSubject'
                      mode='multiple'
                      style={{ width: '100%' }}
                      placeholder='请选择该课件适用的学科'
                      value={this.state.shareCourseInfo.subjectIds}
                      onChange={this.subjectsHandleChange}
                    >
                        {this.state.allSubjects.map((item) => {
                            return (
                                <Option key={item.subjectId} value={item.subjectId}>{item.alias}</Option>
                            )
                        })}
                    </Select>
                    <p className='courseGradeTitle'>适用年级<span>(可多选)</span></p>
                    <Select
                      className='courseGrade'
                      mode='multiple'
                      style={{ width: '100%' }}
                      placeholder='请选择该课件适用的年级'
                      value={this.state.shareCourseInfo.gradeIds}
                      onChange={this.gradesHandleChange}
                    >
                        {this.state.allGrades.map((item) => {
                            return (
                                <Option key={item.gradeId} value={item.gradeId}>{item.gradeName}</Option>
                            )
                        })}
                    </Select>
                    <p className='courseDescribeTitle'>课件描述</p>
                    <Input type='textarea' value={this.state.shareCourseInfo.summary} onChange={this.courseDescribeChange} className='courseDescribe' placeholder='这份课件的主要内容是什么？' autosize={{ minRows: 6, maxRows: 6 }} maxLength={50} />
                    <span className={this.state.summaryLength === 50 ? 'describeTip warnTip' : 'describeTip'}>{this.state.summaryLength}/50</span>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { account: {visitor}, courseEntry: {myCourse: {list, searchValue, myFolderData}} } = state;
    return {
        visitor,
        list,
        searchValue,
        myFolderData
    }
};

export default connect(mapStateToProps)(CSSModules(MyCourse, style));
