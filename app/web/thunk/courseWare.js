/**
 * 用户课件业务逻辑, 关联Reudx
 * */
import * as Lodash from 'lodash';
import * as Api from '../api/coursewareInfo/courseWareApi';
import * as Types from '../actions/actionTypes';
import { message } from 'antd';

/**
 * 处理课件资源业务逻辑
 * */
export function handleCourseWareResource (id) {
    return async (dispatch) => {
        dispatch({type: Types.UPDATE_DOWNLOAD_MODAL, data: {visible: true}})
        const { data } = await Api.fetchCourseWareUrl(id);
        if (data) {
            dispatch({
                type: Types.UPDATE_DOWNLOAD_MODAL,
                data: Lodash.merge({visible: true}, data)
            })
        } else {
            message.error(data.message);
        }
    }
}

/**
 * 关闭下载Dialog
 * */
export const closeDownLoadModal = () => dispatch => {
    dispatch({
        type: Types.UPDATE_DOWNLOAD_MODAL,
        data: {visible: false}
    });
}

/**
 * 下载资源文件, 关闭下载Dialog
 * */
export const downLoadResource = (url) => dispatch => {
    const link = document.createElement('a');
    link.href = url;
    link.click();
    dispatch({type: Types.UPDATE_DOWNLOAD_MODAL, data: {visible: false}})
    // window.location.href = url;
}
