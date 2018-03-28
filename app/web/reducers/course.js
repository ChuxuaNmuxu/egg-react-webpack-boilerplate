import merge from 'lodash/merge';
import assign from 'lodash/assign'
import {
    COURSE_KNOWLEDGE_REQUEST,
    COURSE_KNOWLEDGE_SUCCESS,
    COURSE_KNOWLEDGE_FAILURE,
    COURSE_COURSE_REQUEST,
    COURSE_COURSE_SUCCESS,
    COURSE_COURSE_FAILURE,
    SUBJECT_REQUEST,
    SUBJECT_SUCCESS,
    UPLOAD_KNOWLEDGE_SUCCESS,
    UPLOAD_COURSE_SUCCESS,
    UPLOAD_COURSE_REQUEST,
    UPLOAD_COURSE_FAILURE
} from '../actions/actionTypes';
import initialState from './initialState';

const course = (state = initialState.course, action) => {
    let type = action.type;
    if (type === COURSE_KNOWLEDGE_REQUEST) {
        // 章节异步请求
        return merge({}, state, {
            knowledge: {
                isFetching: true
            }
        });
    } else if (type === COURSE_KNOWLEDGE_SUCCESS) {
        // 章节请求成功
        return Object.assign({}, state, {
            knowledge: {
                isFetching: false,
                meta: {
                    subjectId: action.subjectId
                },
                data: action.data.children
            }
        });
    } else if (type === COURSE_KNOWLEDGE_FAILURE) {
        // 章节请求失败
        return merge({}, state, {
            knowledge: {
                isFetching: false
            }
        });
    } else if (type === COURSE_COURSE_REQUEST) {
        console.log('action', action);
        // 异步请求课程数据
        return merge({}, state, {
            courseData: {
                isFetching: true
            }
        });
    } else if (type === COURSE_COURSE_SUCCESS) {
        console.log('action', action);
        // 异步请求课程数据成功
        return assign({}, state, {
            courseData: {
                isFetching: false,
                meta: {
                    subjectId: action.subjectId
                },
                data: action.data
            }
        });
    } else if (type === COURSE_COURSE_FAILURE) {
        console.log('action', action);
        // 异步请求课程数据失败
        return merge({}, state, {
            courseData: {
                isFetching: false
            }
        });
    } else if (type === SUBJECT_REQUEST) {
        return merge({}, state, {
            subjectData: {
                isFetching: true
            }
        });
    } else if (type === SUBJECT_SUCCESS) {
        return merge({}, state, {
            subject: {
                isFetching: false,
                data: action.data,
                meta: {
                    firstValue: action.data[0].name,
                    firstValueId: action.data[0].id
                }
            }
        });
    } else if (type === UPLOAD_KNOWLEDGE_SUCCESS) {
        var lastKnowledge = [];
        state.uploadKnowledge.data.push(action.data);
        const find = (data, id, a) => {
            ++a;
            return data.map(function (value) {
                if (value.children.length > 0) {
                    return find(value.children, value.id, a)
                } else if (a < 3) {
                    lastKnowledge.push({
                        id: value.id,
                        data: value
                    })
                } else {
                    lastKnowledge.push({
                        id: id,
                        data: value
                    })
                }
            })
        };
        state.uploadKnowledge.data.map(function (value) {
            let i = 0;
            find(value.data, value.subjectId, i)
        });
        return merge({}, state, {
            uploadKnowledge: {
                data: state.uploadKnowledge.data,
                lastKnowledge: lastKnowledge
            }
        })
    } else if (type === UPLOAD_COURSE_REQUEST) {
        return merge({}, state, {
            uploadCourse: {
                isFetching: true
            }
        });
    } else if (type === UPLOAD_COURSE_SUCCESS) {
        return merge({}, state, {
            uploadCourse: {
                isFetching: false,
                data: action.data
            }
        });
    } else if (type === UPLOAD_COURSE_FAILURE) {
        return merge({}, state, {
            uploadCourse: {
                isFetching: false,
                data: action.err
            }
        });
    }

    return state;
}

export default course;
