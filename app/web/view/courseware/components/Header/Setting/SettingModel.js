import React from 'react';
import PropTypes from 'prop-types';
import {Modal, Button, message} from 'antd';
import {connect} from 'react-redux';
import {filter, mapKeys, mergeWith, isArray} from 'lodash';

import SettingForm from './SettingForm';
// import tipAlsoBig from '../../../../../public/images/tip-also-big.png';
// import tipAlso from '../../../../../public/images/tip-also.png';
import {shareGetInfo, fetchMyCourseFolder, saveCourseInfo, moveCourse} from '../../../../../actions/courseEntry';
import {fetchAllGrade, fetchAllSubject} from '../../../../../actions/yunBasic';

class SettingModel extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            coursewareInfo: {
                name: '',
                summary: '',
                file: {
                    select: [],
                    totalList: []
                },
                grade: {
                    select: [],
                    totalList: []
                },
                subject: {
                    select: [],
                    totalList: []
                }
            }
        }

        this.saveCoursewareInfo = this.saveCoursewareInfo.bind(this);
    }

    componentDidMount () {
        const {courseId, schoolId, getCoursewareInfo, getGradeList, getSubjectList, getFileList} = this.props;

        const gradeListPromise = getGradeList(schoolId).then(this.errorInfo); // 课件列表
        const subjectListPromise = getSubjectList(schoolId).then(this.errorInfo); // 学科列表
        const coursewareInfoPromise = getCoursewareInfo(courseId).then(this.errorInfo); // 课件信息
        const filePromise = getFileList().then(this.errorInfo); // 文件夹列表

        Promise.all([gradeListPromise, subjectListPromise, coursewareInfoPromise, filePromise]).then(([grades, subjects, courseInfo, files]) => {
            const subjectIds = courseInfo.subjectIdList;
            const gradeIds = courseInfo.gradeIdList;

            // 被选中的年级列表和学科列表
            const subjectList = filter(subjects, value => subjectIds.findIndex(id => value.subjectId === id) > -1);
            const gradeList = filter(grades.rows, value => gradeIds.findIndex(id => value.gradeId === id) > -1);

            // 总的文件夹列表，加上‘默认文件夹’
            files.unshift({id: '0', name: '默认文件夹'});

            const coursewareInfo = {
                name: courseInfo.name,
                subject: {
                    totalList: this.normalizeData(subjects),
                    select: subjectList.map(value => value.subjectId)
                },
                grade: {
                    totalList: this.normalizeData(grades.rows),
                    select: gradeList.map(value => value.gradeId)
                },
                summary: courseInfo.summary,
                file: {
                    totalList: this.normalizeData(files),
                    select: courseInfo.folderId
                }
            }
            this.setState({
                coursewareInfo
            }, () => {
                console.log(888, courseInfo)
            })
        })
        .catch(error => {
            throw new Error(error)
        })
    }

    // 请求数据兼容性处理
    normalizeData (data) {
        return data.map(value => mapKeys(value, (value, key) => {
            if (/alias|name/i.test(key)) {
                return 'name'
            } else if (/id/i.test(key)) {
                return 'id'
            } else {
                return key
            }
        })
        )
    }

    errorInfo (res) {
        if (res.code === 0) {
            return res.data;
        } else {
            message.warning(res.message);
        }
    }

    saveCoursewareInfo () {
        this.form.props.form.validateFields((errors) => {
            if (!errors) {
                const formInfo = this.form.props.form.getFieldsValue();
                const {name, subject, grade, summary, file} = formInfo;
                const {courseId, saveCourseInfo, moveCourse} = this.props;

                const needMove = formInfo.file !== this.state.coursewareInfo.file.select;

                this.setState({
                    coursewareInfo: mergeWith({}, this.state.coursewareInfo, {
                        name,
                        subject: {
                            select: subject
                        },
                        grade: {
                            select: grade
                        },
                        summary: summary,
                        file: {
                            select: file
                        }
                    }, (objValue, sourceValue) => {
                        if (isArray(objValue)) return sourceValue
                    })
                }, () => {
                    console.log(78, this.state.coursewareInfo)
                    this.props.handleVisible()
                    saveCourseInfo(courseId, name, subject, grade, summary);
                    needMove && moveCourse(file, courseId);
                })
            }
        })
    }

    render () {
        const {visible = true, handleVisible} = this.props;
        return <Modal
          visible={visible}
          className='editCourseModal'
          width='500'
          title='课件信息'
          onCancel={handleVisible}
          footer={[
              <Button className='shareCourse' onClick={this.saveCoursewareInfo} key='down' size='large'>保存</Button>,
              <Button className='shareCancel' onClick={handleVisible} key='close' size='large'>取消</Button>
          ]}
        >
            <SettingForm
              coursewareInfo={this.state.coursewareInfo}
              wrappedComponentRef={e => { this.form = e }}
            />
        </Modal>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCoursewareInfo: id => dispatch(shareGetInfo(id)),
        getGradeList: id => dispatch(fetchAllGrade(id)),
        getSubjectList: id => dispatch(fetchAllSubject(id)),
        getFileList: () => dispatch(fetchMyCourseFolder()),
        saveCourseInfo: (courseId, name, subjectIds, gradeIds, summary) => dispatch(saveCourseInfo(courseId, name, subjectIds, gradeIds, summary)),
        moveCourse: (folderId, courseId) => dispatch(moveCourse(folderId, courseId))
    }
}

const mapStateToProps = (state) => {
    const { account: {visitor} } = state;
    return {
        schoolId: visitor.schoolId[0]
    }
}

SettingModel.propTypes = {
    courseId: PropTypes.string,
    schoolId: PropTypes.string,
    visible: PropTypes.bool,
    getCoursewareInfo: PropTypes.func,
    getGradeList: PropTypes.func,
    getSubjectList: PropTypes.func,
    handleVisible: PropTypes.func,
    getFileList: PropTypes.func,
    moveCourse: PropTypes.func,
    saveCourseInfo: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingModel);
