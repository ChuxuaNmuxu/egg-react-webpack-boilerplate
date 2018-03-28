import * as actionTypes from './actionTypes';
import api from '../utils/api';
import config from '../../config';
import moment from 'moment';

import {changeHeadTitle} from './courseware'

export const fetchMyCourseListSuccess = (json) => {
    return {
        type: actionTypes.FETCHMYCOURSELIST_SUCCESS,
        json
    }
}

// 新建 课件 时要获取ID
export const buildCourseGetId = () => {
    const time = new Date();
    let month = time.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    return (dispatch) => {
        const params = {
            coverId: 0,
            title: `未命名课件${time.getFullYear()}${month}${time.getDate()}`,
            ppt: {}
        }
        return api.post(config.apiResolve('current', 'api/user/coursewares'), params, 'json');
    }
}

// 课件删除
export const deleteCourse = (id) => {
    return (dispatch) => {
        return api.delete(config.apiResolve('current', `api/user/coursewares/${id}`));
    }
}

// 我的课件列表
export const fetchCourseList = (page = 1, pageSize = 10, folderId = null, keyword = null) => {
    return (dispatch) => {
        const params = {
            page: page,
            pageSize: pageSize,
            folderId: folderId,
            keyword: keyword
        }
        api.get(config.apiResolve('current', 'api/user/coursewares'), params, 'json').then(json => {
            if (json.code === 0) {
                for (let i of json.data) {
                    i.updatedAt = i.updatedAt ? moment(i.updatedAt).format('YYYY年MM月DD日  HH:mm:ss') : '-';
                    i.syncEta = i.syncEta ? moment(i.syncEta).format('MM/DD  HH:mm') : '-';
                }
                dispatch(fetchMyCourseListSuccess(json));
            }
        })
    }
}

// 分享或取消分享课件
export const shareCourse = (id, bol) => {
    return () => {
        return api.put(config.apiResolve('current', `api/user/coursewares/${id}/shared`), {
            shared: bol
        }, 'json')
    }
}

// 获取课件下载地址
export const fetchCourseUrl = (id) => {
    return () => {
        return api.post(config.apiResolve('current', `api/user/coursewares/${id}/download`))
    }
}

// 分享课件获取课件已有信息,用来回填
export const shareGetInfo = (id) => {
    return () => {
        return api.get(config.apiResolve('current', `api/user/coursewares/${id}/info`));
    }
}

// 保存课件信息
export const saveCourseInfo = (id, name, subjectIds, gradeIds, summary) => {
    return (dispatch, getState) => {
        dispatch(changeHeadTitle(name, id));

        return api.put(config.apiResolve('current', `api/user/coursewares/${id}/info`), {
            name,
            subjectIds,
            gradeIds,
            summary
        }, 'json')
    }
}

// 同步课件
export const synchronizationCourse = (id) => {
    return () => {
        return api.put(config.apiResolve('current', `api/user/coursewares/${id}/sync`), {}, 'json')
    }
}

// 移动课件
export const moveCourse = (key, info) => {
    return () => {
        return api.put(config.apiResolve('current', `api/user/coursewares/${info}/move`),
            {
                folderId: key
            }, 'json')
    }
}

// 进入PPT 页面前先请求数据 怼进redux里的courseware
export const getEditCourseData = (coursewareId) => {
    return (dispatch) => {
        return api.get(config.apiResolve('current', `api/user/coursewares/${coursewareId}`)).then(res => {
            if (res.code === 0) {
                dispatch({
                    type: actionTypes.COURSE_EDITOR_GET_DATA,
                    payload: res
                });
                return res;
            }
        }).catch(err => {
            console.log(err);
        })
    }
}

// 导入PPT时请求的接口-第一步 获取 上传参数
export const uploadGetParams = () => {
    return (dispatch) => {
        return api.post(config.apiResolve('current', 'api/upload/oss-parameters'));
    }
}

// 导入PPT时请求的接口-第三步 获取到oss返回的fileId 再请求/api/actions/import-ppt
// （第二步：上传到oss，已经在upload自带的action里面完成了）
export const importCourse = (name, fileId) => {
    return (dispatch) => {
        return api.post(config.apiResolve('current', 'api/user/coursewares/import-ppt'), {
            name,
            fileId
        }, 'json');
    }
}

// 我的课件 获取当前用户的所有自定义文件夹
export const fetchMyCourseFolder = () => {
    return (dispatch) => {
        return api.get(config.apiResolve('current', 'api/user/folders'))
    }
}

// 我的课件 新建文件夹
export const fetchMyCourseNewFolder = (params) => {
    return () => {
        return api.post(config.apiResolve('current', 'api/user/folders'), params, 'json')
    }
}

// 我的课件 修改文件夹名称
export const fetchMyCourseEditFolder = (id, name) => {
    return () => {
        return api.put(config.apiResolve('current', 'api/user/folders/' + id), {name}, 'json')
    }
}

// 我的课件 文件夹排序
export const fetchMyCourseFolderSort = (idArr) => {
    return () => {
        return api.put(config.apiResolve('current', 'api/user/folders/order'), {ids: idArr}, 'json')
    }
}

// 我的课件 删除文件夹
export const fetchDeleteMyCourseFolder = (id) => {
    return () => {
        return api.delete(config.apiResolve('current', 'api/user/folders/') + id)
    }
}
