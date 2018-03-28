import merge from 'lodash/merge';
import {
    LOGIN, LOGOUT,
    FETCH_VISITOR_SUCCESS, FETCH_VISITOR_FAILED
} from '../actions/actionTypes';
import initialState from './initialState';

const account = (state = initialState.account, action) => {
    let type = action.type;
    if (type === LOGIN) {
        // 登录
        return merge({}, state, {
            visitor: action.visitor,
            isLoggedOut: false
        });
    } else if (type === LOGOUT) {
        // 退出
        return merge({}, state, {
            visitor: null,
            isLoggedOut: true
        });
    } else if (type === FETCH_VISITOR_SUCCESS) {
        // 获取用户信息成功
        return merge({}, state, {
            visitor: action.visitor,
            isAdmin: action.isAdmin
        });
    } else if (type === FETCH_VISITOR_FAILED) {
        // 获取用户信息失败
        return merge({}, state, {
            visitor: null,
            isAdmin: 0
        });
    }
    return state;
}

export default account;
