import api from '../utils/api';
import config from '../../config';
import {
    COURSE_KNOWLEDGE_REQUEST,
    COURSE_KNOWLEDGE_SUCCESS,
    COURSE_KNOWLEDGE_FAILURE,
    COURSE_COURSE_REQUEST,
    COURSE_COURSE_SUCCESS,
    COURSE_COURSE_FAILURE,
    SUBJECT_SUCCESS,
    UPLOAD_KNOWLEDGE_SUCCESS,
    UPLOAD_COURSE_SUCCESS,
    UPLOAD_COURSE_REQUEST,
    UPLOAD_COURSE_FAILURE
} from './actionTypes';
import utils from '../utils/utils';
import {message} from 'antd';
export const courseKnowledgeRequest = () => {
    return {
        type: COURSE_KNOWLEDGE_REQUEST
    }
}

export const courseKnowledgeSuccess = (data, subjectId) => {
    return {
        type: COURSE_KNOWLEDGE_SUCCESS,
        subjectId: subjectId,
        data: data
    }
}

export const courseKnowledgeFailure = (error) => {
    return {
        type: COURSE_KNOWLEDGE_FAILURE,
        error: error
    }
}

export const courseRequest = () => {
    return {
        type: COURSE_COURSE_REQUEST
    }
}

export const courseSuccess = (data) => {
    return {
        type: COURSE_COURSE_SUCCESS,
        data: data
    }
}

export const courseCourseFailure = (error) => {
    return {
        type: COURSE_COURSE_FAILURE,
        error: error
    }
}

export const subjectSuccess = (data) => {
    return {
        type: SUBJECT_SUCCESS,
        data: data
    }
}

export const uploadKnowledge = (data, id) => {
    return {
        type: UPLOAD_KNOWLEDGE_SUCCESS,
        data: {
            subjectId: id,
            data: data.children
        }
    }
}
export const uploadCourseRequest = (data) => {
    return {
        type: UPLOAD_COURSE_REQUEST
    }
}
export const uploadCourseSuccess = (data) => {
    return {
        type: UPLOAD_COURSE_SUCCESS,
        data: data
    }
}
export const uploadCourseFailure = (data) => {
    return {
        type: UPLOAD_COURSE_FAILURE,
        err: data
    }
}
export function fetchUploadCourse (formdata, type, selectedSubject, size) {
    return function (dispatch) {
        const hide = message.loading('上传课件中，请稍后......', 0);
        dispatch(uploadCourseRequest());
        api.post(config.apiResolve('cjcms', 'rpc/user/resource/upload.do'), formdata, type)
            .then(json => {
                setTimeout(hide, 0);
                dispatch(fetchCourseList(0, selectedSubject, null, size))
                dispatch(uploadCourseSuccess(json))
            })
            .catch(err => {
                dispatch(uploadCourseFailure(err))
            })
    }
}
export function fetchUploadKnowledge (subjectArr) {
    return function (dispatch) {
        subjectArr.map(function (value) {
            api.get(config.apiResolve('cjcms', 'api/knowledge/tree.do?'), {subjectId: value.id})
                .then(json => {
                    dispatch(uploadKnowledge(json, value.id));
                })
        })
    }
}
// 查询章节
export function fetchCourseKnowledge (subjectId) {
    return function (dispatch) {
        dispatch(courseKnowledgeRequest())
        return api.get(config.apiResolve('cjcms', 'api/knowledge/tree.do?'), {subjectId: subjectId})
            .then(json => {
                dispatch(courseKnowledgeSuccess(json, subjectId))
            })
            .catch(error => {
                dispatch(courseKnowledgeFailure(error))
            })
    }
}
// 查询课件列表--------第一次初始化请求应该是无参数的
export function fetchCourseList (page, subjectId, knowledgeId, size) {
    return function (dispatch) {
        if (size === undefined) {
            size = 20;
        }
        dispatch(courseRequest());
        return api.get(config.apiResolve('cjcms', 'api/user/resources/paged.do?'), { page: page, size: size, subjectId: subjectId, knowledgeId: knowledgeId })
            .then(json => {
                dispatch(courseSuccess(json));
            })
            .catch(error => {
                dispatch(courseCourseFailure(error))
            })
    }
}

// 查询科目
export function fetchSubject (defaultSubject) {
    return function (dispatch) {
        return api.get(config.apiResolve('cjcms', 'api/subjects.do'))
            .then(json => {
                dispatch(subjectSuccess(json));
                if (defaultSubject) {
                    json.map(function (data) {
                        if (data.name === defaultSubject) {
                            dispatch(fetchCourseKnowledge(data.id))
                            dispatch(fetchCourseList(0, data.id))
                        }
                    })
                } else if (utils.getCookie('defaultSubjectValue')) {
                    json.map(function (data) {
                        if (data.name === utils.getCookie('defaultSubjectValue')) {
                            dispatch(fetchCourseKnowledge(data.id))
                            dispatch(fetchCourseList(0, data.id))
                        }
                    })
                } else {
                    dispatch(fetchCourseKnowledge(json[0].id))       // 初始化请求第一个科目的知识点
                    dispatch(fetchCourseList(0, json[0].id))
                }
                dispatch(fetchUploadKnowledge(json))
            })
            .catch(error => {
                console.log('获取科目列表失败', error)
            })
    }
}

export function fetchDelCourse (deleId) {     // TODO 删除后应重新触发分页
    return function () {
        return api.delete(config.apiResolve('cjcms', 'api/user/resources.do?'), {id: deleId})
            .then(json => {
                console.log('删除课件成功', json);
            })
            .catch(error => {
                console.log('删除课件失败', error)
            })
    }
}
