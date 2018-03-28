import {Base64} from 'js-base64';
import Cookies from 'js-cookie';
import {message} from 'antd';
// import {browserHistory} from 'react-router';
import { withRouter } from 'react-router'

import Utils from '../utils';
import api from '../utils/api';
import config from '../../config';
import Helper from '../../config/helper';
import {
    LOGIN,
    LOGOUT,
    FETCH_VISITOR_SUCCESS,
    FETCH_VISITOR_FAILED
} from './actionTypes';

export const login = (token, visitor) => {
    Cookies.get('token') || Utils.setTopLevelCookie('token', token);
    try {
        visitor = visitor && JSON.parse(Base64.decode(visitor.replace(/ /g, '+')));
        visitor && (Cookies.get('visitor') || Utils.setTopLevelCookie('visitor', visitor));
    } catch (e) {
        Utils.removeTopLevelCookie('visitor');
        visitor = null;
    }
    window.visitor = visitor;
    return {
        type: LOGIN,
        visitor
    }
}

export const logoutSuccess = () => {
    Utils.removeAllCookies();
    return {
        type: LOGOUT
    }
}

export const fetchVisitorSuccess = (visitor) => {
    visitor = Object.assign({}, visitor);
    Utils.setTopLevelCookie('visitor', Base64.encode(JSON.stringify(visitor)));
    let isAdmin = 0;
    if (visitor.type === 'manager') {
        isAdmin = 1;     // 系统管理员
    } else if (visitor.type === 'school' && visitor.schoolRoleList.indexOf('SYSMANAGER') > -1) {
        isAdmin = 2;      // 学校管理员
    }
    Utils.setTopLevelCookie('isAdmin', isAdmin);
    return {
        type: FETCH_VISITOR_SUCCESS,
        visitor,
        isAdmin
    }
}

export const fetchVisitorFailed = () => {
    Utils.removeTopLevelCookie('visitor');
    return {
        type: FETCH_VISITOR_FAILED
    }
}

export const gotoLogin = (directUrl = '', query = {}, browserHistory) => {
    if (!directUrl) {
        let {pathname, query} = browserHistory.getCurrentLocation()
        // 去掉dir_deploy
        if (config.dir_deploy && config.dir_deploy !== '/') {
            pathname = pathname.replace(config.dir_deploy, '');
        }
        directUrl = Helper.siteResolve('current', pathname, query);
    }
    window.location.href = Helper.siteResolve('cjyun', 'login', Object.assign(query, {
        url: directUrl
    }));
}

/**
 * 退出
 * @param {*} silence 是否静默退出
 */
export function logout (silence) {
    return function (dispatch) {
        return api.post(Helper.apiResolve('cjyun', 'unlogin/logout.cbp'))
            .then(res => {
                silence || message.success('您已成功退出！');
                dispatch(logoutSuccess());
            }).catch(error => {
                console.log(error);
                silence || message.success('退出成功');
                dispatch(logoutSuccess());
            })
    }
}

export function fetchVisitor () {
    return function (dispatch) {
        return api.get(Helper.apiResolve('cjyun', 'unverify/getTokeneffective'))
            .then(res => {
                if (res.code === 0) {
                    dispatch(fetchVisitorSuccess(res.data));
                } else {
                    dispatch(fetchVisitorFailed());
                }
            })
            .catch(() => {
                dispatch(fetchVisitorFailed());
            });
    }
}
