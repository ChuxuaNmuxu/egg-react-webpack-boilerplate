/**
 * Created by 万叙杰 on 2017/8/3.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import style from './CoursewareList.scss';
import {Dropdown, Menu, Button, Tooltip} from 'antd';
import defaltbg from '../../../../public/images/defaltbg.png';
import TextUtils from '../../../../utils/textUtils';

const SubMenu = Menu.SubMenu;

class CoursewareList extends Component {
    constructor (props) {
        super(props);
        this.state = {
            menu: (
                <Menu onClick={this.menuClick}>
                    <Menu.Item key='download'>下载</Menu.Item>
                    <SubMenu title='移动到'>
                        {props.myFolderData && props.myFolderData.map((item, index) => {
                            return (
                                <Menu.Item key={item.id}>{item.name}</Menu.Item>
                            )
                        })}
                    </SubMenu>
                    <Menu.Item key='delete'>删除</Menu.Item>
                </Menu>
            ),
            item: this.props.item,
            shareText: '已分享'
        };
    }

    static defaultProps = {
        MyCourseOrSchoolCourse: '0'     // 当前页面，0为我的课件页面，1为校本资源页面，默认为0
    }

    componentWillReceiveProps (nextProps) {
        const {item, myFolderData} = nextProps;
        this.setState({
            item
        })
        myFolderData && this.setState({
            menu: (
                <Menu onClick={this.menuClick}>
                    <Menu.Item key='download'>下载</Menu.Item>
                    <SubMenu title='移动到'>
                        {myFolderData && myFolderData.map((item, index) => {
                            return (
                                <Menu.Item key={item.id}>{item.name}</Menu.Item>
                            )
                        })}
                    </SubMenu>
                    <Menu.Item key='delete'>删除</Menu.Item>
                </Menu>
            )
        })
    }

    menuClick = ({key}) => {
        const newKey = TextUtils.format$Prefix(key);
        const { menuClick, item } = this.props;
        menuClick && menuClick(newKey, item.id);
        // const {dispatch} = this.props.props;
        // if (newKey === 'download') {
        //     dispatch(actions.fetchCourseUrl(this.props.item.id)).then(json => {
        //         if (json.code === 0) {
        //             this.props.menuClick(newKey, json.data.url);
        //         } else {
        //             message.error(`获取课件下载地址失败:${json.message}`);
        //         }
        //     })
        // } else {
        //     this.props.menuClick(newKey, this.props.item.id);
        // }
    }

    // 急速同步, 并下载课件资源
    getCourseDownLoadUrl = (id) => {
        const { menuClick, item } = this.props;
        menuClick && menuClick('download', item.id);
        // const {dispatch} = this.props.props;
        // dispatch(actions.fetchCourseUrl(id)).then(json => {
        //     if (json.code === 0) {
        //         this.props.downloadCourseModal(json.data)
        //     } else {
        //         message.error(`获取课件下载地址失败:${json.message}`);
        //     }
        // })
    }

    onMouseEnter = () => {
        this.setState({
            shareText: '取消分享'
        })
    }

    onMouseLeave = () => {
        this.setState({
            shareText: '已分享'
        })
    }

    // 编辑课件
    editCourse = (id) => {
        window.open(`ppt/${id}`);
    }

    // 播放课件
    playCourse = (id) => {
        window.open(`/play/${id}`);
    }

    render () {
        const {MyCourseOrSchoolCourse} = this.props;
        const {item} = this.state;
        return (
            <div styleName='coursewareList' className='coursewareList'>
                <div className='pptImg'>
                    <img src={item.coverUrl || defaltbg} style={{width: '100%'}} />
                </div>
                <div className='contentArea'>
                    <p className='topP'>
                        <span className='contentTitle'>{item.name}</span>
                        {MyCourseOrSchoolCourse ? null : <span className='contentIcon'>
                            {item.syncStatus === 0 ? <Tooltip title='点击同步到学校' placement='left' getPopupContainer={() => document.getElementsByClassName('coursewareList')[0]}><i className='iconfont icon-tongbu' onClick={() => this.props.synchronization(item.id)} /></Tooltip> : null}
                            {item.syncStatus === (1 || 2 || 4) ? <Tooltip title={<span>预计同步时间：{item.syncEta}<a onClick={() => this.getCourseDownLoadUrl(item.id)}>着急使用？</a></span>} placement='left' getPopupContainer={() => document.getElementsByClassName('coursewareList')[0]}><i className='iconfont icon-xiazai' /></Tooltip> : null}
                            {item.syncStatus === 3 ? <Tooltip title='已同步到学校' placement='left' getPopupContainer={() => document.getElementsByClassName('coursewareList')[0]}><i className='iconfont icon-yunshuju' /></Tooltip> : null}
                            <Dropdown overlay={this.state.menu} trigger={['click']} placement='bottomLeft'>
                                <a className='ant-dropdown-link' href='#'>
                                    <i className='iconfont icon-caidan' />
                                </a>
                            </Dropdown>
                        </span>}
                    </p>
                    <div className='courseOperation'>
                        <div className='contentDescribe'>
                            <p className='describe'><span>描述：</span><span>{item.summary || '无'}</span></p>
                            <p className='courseInfo'>
                                {MyCourseOrSchoolCourse ? <span className='courseAuthor'><i className='iconfont icon-people' /><span className='info'>{item.userName}</span></span> : null}
                                {MyCourseOrSchoolCourse ? <span className='star'><i className='iconfont icon-shoucang' /><span className='info'>{item.copyCount}</span></span> : null}
                                <span className='time'><i className='iconfont icon-shijian1' /><span className='info'>{item.updatedAt}</span></span>
                            </p>
                        </div>
                        {MyCourseOrSchoolCourse ? <div className='operationBtn top'>
                            <Button className='preview' onClick={() => this.playCourse(item.id)}>预览</Button>
                            {item.copied || item.userCourseware ? <Button className='preservationed' disabled>已保存</Button> : <Button className='preservation' onClick={() => this.props.saveCourseToFolder(item.id)}>保存到我的</Button>}
                        </div> : <div className='operationBtn'>
                            {item.canShare ? <Button className={item.shared ? 'share shared' : 'share canShare'} onClick={() => this.props.shareCourse(item.id, item.shared, item.name)} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>{item.shared ? this.state.shareText : '分享'}</Button> : <Button className='share' disabled>来自分享</Button>}
                            <Button className='open' onClick={() => this.editCourse(item.id)}>打开</Button>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }
}

CoursewareList.propTypes = {
    MyCourseOrSchoolCourse: PropTypes.any,
    item: PropTypes.any,
    props: PropTypes.any,
    dispatch: PropTypes.any,
    downloadCourseModal: PropTypes.any,
    deleteCourseModal: PropTypes.any,
    menuClick: PropTypes.any,
    shareCourse: PropTypes.any,
    saveCourseToFolder: PropTypes.any,
    synchronization: PropTypes.any,
    myFolderData: PropTypes.any
}

export default CSSModules(CoursewareList, style);
