/**
 * Created by 万叙杰 on 2017/8/7.
 */
import * as actionTypes from './actionTypes';
import api from '../utils/api';
import config from '../../config';
import moment from 'moment';

export const fetchSchoolCourseListSuccess = (json) => {
    return {
        type: actionTypes.FETCHSCHOOLCOURSELIST_SUCCESS,
        json
    }
}

// 校本课件列表
export const fetchCourseList = (page = 1, pageSize = 10, subjectId = null, keyword = null, gradeId = null) => {
    return (dispatch) => {
        const params = {
            page: page,
            pageSize: pageSize,
            subjectId: subjectId,
            keyword: keyword,
            gradeId: gradeId
        }
        api.get(config.apiResolve('current', 'api/shared/coursewares'), params, 'json').then(json => {
            if (json.code === 0) {
                for (let i = 0; i < json.data.length; i++) {
                    json.data[i].updatedAt = json.data[i].updatedAt ? moment(json.data[i].updatedAt).format('YYYY年MM月DD日  HH:mm:ss') : '-';
                }
                dispatch(fetchSchoolCourseListSuccess(json));
            }
        })
    }
}

// 校本资源 请求年纪数据
export const fetchSchoolCourseGrade = (schoolId) => {
    return () => {
        return api.get(config.apiResolve('cjyun', 'school/' + schoolId + '/gradeList'))
    }
}

// 校本资源 请求学科数据
export const fetchSchoolCourseSubject = (schoolId) => {
    return () => {
        return api.get(config.apiResolve('cjyun', 'schoolSubject/list'), {schoolId: schoolId})
    }
}

// 校本资源 保存学校课件到指定文件夹
export const fetchSchoolCourseToMyFolder = (courseId, folderId) => {
    return () => {
        return api.post(config.apiResolve('current', 'api/shared/coursewares/') + courseId + '/copy', {folderId}, 'json')
    }
}
