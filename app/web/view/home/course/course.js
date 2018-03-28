/**
 * Created by Administrator on 2017/1/6.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CourseTree from './courseTree/courseTree'
import CourseItem from './courseItem/courseItem'
import CSSModules from 'react-css-modules';
import styles from './course.scss';
import { Row, Col } from 'antd';
import { fetchCourseKnowledge, fetchCourseList, fetchSubject, fetchDelCourse } from '../../../actions/course';
import { merge } from 'lodash';
// 左边的树形章节篇,还有点问题(默认初始化选择没有记载),具体显示应该根据所选科目的Id号,动态加载某一个学科的目录.而state里面是所有学科(包括ID)和所有学科的目录,Tree插件显示数据还有点问题,重要问题就是刚进页面所有内容的初始化(包括,下拉学科,章节知识点,右边的课件内容,以及分页)

/**
 * 这里的课程请求要做成通用的,参数大概为(学科或者章节的ID,页数);-----注意这里的每页的数据量个数要不要传?
 */

class Course extends Component {
    constructor (props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.deleteCourse = this.deleteCourse.bind(this);
        this.handleShowSizeChange = this.handleShowSizeChange.bind(this);
        // 管理每次分页的初始化页数
        this.state = {
            current: 1,
            pagination: {
                page: this.props.subjectData.page,
                size: this.props.subjectData.size
            }
        };
    }

    // (点击选择树)这里要处理item信息,有异步请求且要修改state里面的内容
    onSelect (info) {
        this.setState({ current: 1 });
        const { dispatch } = this.props;
        if (info.length) {
            if (!this.state.currentSubject) {
                this.setState({
                    currentSubject: this.props.subjectData[0].id
                });
                dispatch(fetchCourseList(0, this.props.subjectData[0].id, info[0].substring(2)));
            } else {
                dispatch(fetchCourseList(0, this.state.currentSubject, info[0].substring(2)));
            }
            this.setState({
                currentKnowledge: info[0].substring(2)
            });
        }
    }

    // 课程分页,响应
    onChange (pageNumber) {
        let formattingPageNumber = parseInt(pageNumber);
        this.setState({ current: formattingPageNumber });
        const { dispatch } = this.props;
        if (!this.state.currentSubject) {
            this.setState({
                currentSubject: this.props.subjectData[0].id
            },
                function () {
                    dispatch(fetchCourseList(formattingPageNumber - 1, this.props.subjectData[0].id, null, this.state.pagination.size))
                }
            );
        } else {
            dispatch(fetchCourseList(formattingPageNumber - 1, this.state.currentSubject, this.state.currentKnowledge, this.state.pagination.size));
        }
    }
    // 分选择该页显示多条数据
    handleShowSizeChange (page, size) {
        this.setState(merge(this.state, {
            pagination: {
                page,
                size
            }
        }));
        const { dispatch } = this.props;
        if (!this.state.currentSubject) {
            this.setState({
                currentSubject: this.props.subjectData[0].id
            },
                function () {
                    dispatch(fetchCourseList(page - 1, this.props.subjectData[0].id, null, size));
                }
            );
        } else {
            dispatch(fetchCourseList(page - 1, this.state.currentSubject, this.state.currentKnowledge, size));
        }
    }

    // 选择科目的点击事件
    handleChange (subjectValue) {
        this.setState({ current: 1 });
        const { dispatch } = this.props;
        let subjectId;
        this.props.subjectData.map(function (data) {
            if (data.name === subjectValue) {
                subjectId = data.id;
            }
        });
        // 获取知识点(章节)
        dispatch(fetchCourseKnowledge(subjectId));
        this.setState({
            currentSubject: subjectId,
            currentKnowledge: null
        });
        dispatch(fetchCourseList(0, subjectId, null, this.state.pagination.size));
    }

    // 初始化列表 -- 初步确定为,三个接口,初始化科目,初始化章节,初始化分页列表(同时请求三个接口渲染页面,都是无参)
    componentDidMount () {
        const { dispatch } = this.props;
        // 获取科目
        if (window.localStorage) {
            let defaultSubject = localStorage.getItem(this.props.account.id + this.props.account.userName);
            dispatch(fetchSubject(defaultSubject));
        } else {
            dispatch(fetchSubject());
        }
    }

    deleteCourse (deleId) {
        const { dispatch } = this.props;
        dispatch(fetchDelCourse(deleId));
    }

    render () {
        return (
            <div className='course ui container' styleName='course'>
                <div id='bg' style={{ display: this.props.showBg ? 'block' : 'none' }} />
                <div className='courseHeader'>
                    <span>我的课件</span>
                </div>
                <Row className='courseContent' gutter={15}>
                    <Col span={5} className='gutter-row'>
                        <CourseTree subjectData={this.props.subjectData} firstValue={this.props.firstValue} account={this.props.account}
                          knowledgeData={this.props.knowledgeData} onChange={this.handleChange}
                          onSelect={this.onSelect} className='gutter-box' />
                    </Col>
                    <Col span={19} className='courseItem'>
                        <CourseItem data={this.props.courseData} onChange={this.onChange} current={this.state.current}
                          deleteCourse={this.deleteCourse} handleShowSizeChange={this.handleShowSizeChange} className='gutter-box' />
                    </Col>
                </Row>
                <div style={{ height: '80px' }} />
                {this.test}
            </div>
        )
    }
}

Course.propTypes = {
    courseData: PropTypes.object.isRequired,
    dispatch: PropTypes.any.isRequired,
    subjectData: PropTypes.array.isRequired,
    knowledgeData: PropTypes.array.isRequired,
    firstValue: PropTypes.string,
    showBg: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired
};

function select (state) {
    const { course, account } = state;
    return {
        subjectData: course.subject.data,
        knowledgeData: course.knowledge.data,
        courseData: course.courseData.data,
        firstValue: course.subject.meta.firstValue,
        showBg: course.uploadCourse.isFetching,
        account: account.visitor
    }
}
// 小心connet的参数
export default connect(select)(CSSModules(Course, styles));
