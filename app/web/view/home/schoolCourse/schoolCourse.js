import React, {Component} from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules';
import style from './schoolCourse.scss';
import { browserHistory } from 'react-router';
import {Row, Col, Pagination, message, Icon, Modal, Button} from 'antd';
import CoursewareList from '../../courseware/components/CoursewareList/index';
import NoData from '../../courseware/components/noData/index';
import { merge } from 'lodash';
import * as actions from '../../../actions/schoolCourse';
import PPTfolderSearch from '../../courseware/components/pptfolder/pptfolderSearch/pptfolderSearch';
import SchoolFolder from '../../courseware/components/pptfolder/SchoolFolder/SchoolFolder';
import Folder from '../../courseware/components/pptfolder/MypptFolder/MypptFolder';

class SchoolCourse extends Component {
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
            preservationModalVisible: false,                 // 保存为的modal
            CourseId: null,       // 当前操作的课件id
            menuSelected: [],         // menu年纪 选中值
            selectedValue: null,
            keyword: '',
            myFolderSelected: ['.$0']
        };
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.searchInputClick = this.searchInputClick.bind(this);
        this.myFolderModalClick = this.myFolderModalClick.bind(this);
        this.newFolder = this.newFolder.bind(this);
    }

    componentWillMount () {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
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

    componentDidMount () {
        message.config({
            top: 140,
            getContainer: () => document.getElementById('messageInfo')
        });
    }

    reFetchList = (page = this.state.pagination.page, pageSize = this.state.pagination.pageSize, subjectId = null, keyword = null, gradeId = null) => {
        const {dispatch} = this.props;
        dispatch(actions.fetchCourseList(page, pageSize, subjectId, keyword, gradeId));
    }

    // handle selected
    handleSelect (e) {
        const { dispatch } = this.props;
        this.setState({
            selectedValue: e
        }, () => {
            this.state.menuSelected[0] && this.reFetchList(1, 10, this.state.selectedValue, null, this.state.menuSelected[0].substring(2));
            dispatch({
                type: 'SAVE_SCHOOL_SEARCH_VALUE',
                data: ''
            })
        })
    }

    // handle menu click
    handleMenuClick (e) {
        const { dispatch } = this.props;
        this.setState({
            menuSelected: [e]
        }, () => {
            this.state.selectedValue && this.reFetchList(1, 10, this.state.selectedValue, null, this.state.menuSelected[0] && this.state.menuSelected[0].substring(2));
            dispatch({
                type: 'SAVE_SCHOOL_SEARCH_VALUE',
                data: ''
            })
        })
    }

  // 搜索框点击事件
    searchInputClick (value) {
        const { dispatch } = this.props;
        this.setState({
            keyword: value,
            menuSelected: []
        }, () => {
            this.reFetchList(1, 10, null, this.state.keyword, null)
            dispatch({
                type: 'SAVE_SCHOOL_SEARCH_VALUE',
                data: value
            })
        })
    }

    // 销毁message
    destroyMessage = () => {
        message.destroy();
    }

    // 打开保存到文件夹的modal
    openSaveCourseToFolderModal = (id) => {
        this.setState({
            CourseId: id,
            preservationModalVisible: true
        })
    }

    // 新建文件夹
    newFolder () {
        const { myFolderData, dispatch } = this.props;

        if (!myFolderData[myFolderData.length - 1].err) {
            this.setState({
                myFolderSelected: ['.$' + myFolderData.length]
            });
            myFolderData.push({
                index: myFolderData.length,
                editor: true,
                name: '新建文件夹',
                new: true
            });
            dispatch({
                type: 'SAVE_MY_FOLDER_DATA',
                data: myFolderData
            });
            // 通过ref调不到子组件上的方法 暂时这样手动聚焦吧。
            setTimeout(() => {
                this.folder.getElementsByTagName('input')[0].focus();
            }, 100);
        }
    }

    // 另存确认
    preservationCourse = () => {
        message.destroy();
        const { dispatch, myFolderData } = this.props;
        const { myFolderSelected, CourseId, data } = this.state;
        let folderId = myFolderData[myFolderSelected[0].substring(2)].id;       // 文件夹Id
        if (!myFolderData[myFolderSelected[0].substring(2)].err) {
            dispatch(actions.fetchSchoolCourseToMyFolder(CourseId, folderId)).then((json) => {
                if (json.code === 0) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === CourseId) {
                            data[i].copied = !data[i].copied;
                            data[i].copyCount = data[i].copyCount + 1;
                            break;
                        }
                    }
                    this.setState({
                        preservationModalVisible: false,
                        data,
                        myFolderSelected: ['.$0']
                    }, () => {
                        message.success(<span>保存成功！<a onClick={() => { browserHistory.push('/myCourse' + '?readIndex=' + myFolderSelected[0].substring(2)) }}>点击查看</a><Icon type='close' onClick={this.destroyMessage} /></span>, 0);
                    })
                }
            })
        }
    }

    // 另存取消
    preservationCourseCancel = () => {
        this.setState({
            CourseId: null,
            preservationModalVisible: false,
            myFolderSelected: ['.$0']
        })
    }

    // 分页页码变化
    handlePageChange = (page) => {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        this.setState(merge(this.state, {
            pagination: {
                page
            }
        }), () => this.reFetchList(page, this.state.pagination.pageSize, this.state.selectedValue, this.state.keyword, this.state.menuSelected[0] && this.state.menuSelected[0].substring(2)));
    }

    jumpPage = (page) => {
        document.documentElement.scrollTop = document.body.scrollTop = 0;
        if (this.state.pagination.page !== page) {
            this.setState(merge(this.state, {
                pagination: {
                    page
                }
            }), () => this.reFetchList(page, this.state.pagination.pageSize, this.state.selectedValue, this.state.keyword, this.state.menuSelected[0] && this.state.menuSelected[0].substring(2)));
        }
    }

    // modal内我的文件夹点击事件
    myFolderModalClick (e) {
        this.setState({
            myFolderSelected: e
        })
    }

    render () {
        const { menuSelected, selectedValue } = this.state;
        return (
            <div styleName='schoolCourse' className='schoolCourse'>
                {/* 专门用来存放message弹出层 */}
                <div id='messageInfo' />
                <div className='myCourseware'>
                    <div className='ui container content'>
                        <Row gutter={30}>
                            <Col span={6} className='leftSelect' style={{paddingLeft: 0, paddingRight: 0}}>
                                <PPTfolderSearch searchInputClick={this.searchInputClick} />
                                <SchoolFolder selectedValue={selectedValue} handleSelect={this.handleSelect} menuSelected={menuSelected} handleMenuClick={this.handleMenuClick} />
                            </Col>
                            <Col span={18} className='rightList'>
                                {this.props.searchValue ? <p className='searchContent'>搜索<span className='searchKeyWord'>"{this.props.searchValue}"</span>共搜到<span className='searchKeyWord'>{this.state.pagination.total}</span>份文件</p> : null}
                                {this.state.data.length ? this.state.data.map((item, index) => {
                                    return (
                                        <CoursewareList MyCourseOrSchoolCourse={1} key={index} item={item} props={this.props} saveCourseToFolder={(id) => this.openSaveCourseToFolderModal(id)} />
                                    )
                                }) : this.props.searchValue ? null : <NoData MyCourseOrSchoolCourse={1} />}
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
                    <div id='preservationCourseModal' />
                </div>
                <Modal
                  visible={this.state.preservationModalVisible}
                  className='preservationCourseModal'
                  width='500px'
                  title='保存到我的'
                  maskClosable={false}
                  getContainer={() => document.getElementById('preservationCourseModal')}
                  onCancel={this.preservationCourseCancel}
                  footer={[
                      <Button className='newFolder' onClick={this.newFolder} key='newFolder' size='large'>新建文件夹</Button>,
                      <Button className='preservationCourse' onClick={this.preservationCourse} key='preservation' size='large'>确认</Button>,
                      <Button className='preservationCancel' onClick={this.preservationCourseCancel} key='close' size='large'>取消</Button>
                  ]}
                    >
                    <Folder FolderRef={x => { this.folder = x }} type={2} myFolderModalClick={this.myFolderModalClick} myFolderSelected={this.state.myFolderSelected} />
                </Modal>
            </div>
        )
    }
}

SchoolCourse.propTypes = {
    dispatch: PropTypes.any,
    list: PropTypes.any,
    myFolderData: PropTypes.array,
    searchValue: PropTypes.any
}

const mapStateToProps = (state) => {
    const { courseEntry: {schoolCourse: {list, searchValue}, myCourse: { myFolderData }} } = state;
    return {
        list,
        myFolderData,
        searchValue
    }
};

export default connect(mapStateToProps)(CSSModules(SchoolCourse, style));
