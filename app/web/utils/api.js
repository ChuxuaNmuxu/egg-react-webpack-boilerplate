import 'es6-promise/auto';
import fetch from 'isomorphic-fetch';
import qs from 'qs';
import {Modal, message} from 'antd';
import isEmpty from 'lodash/isEmpty';
import Cookies from 'js-cookie';

import {logout} from '../actions/account';

const errorMessages = (res) => `${res.status} ${res.statusText}`;

let i = [];
function check703 (json) {
    i.push(Modal.error({
        title: '登录验证过期',
        content: json.message || json.data,
        onOk: () => {
            i.forEach(data => data.destroy());
            i = [];
            window.store.dispatch(logout());
        }
    }));
    return Promise.reject(new Error(`${json.code} ${json.message || json.data}`));
}

function checkRes (res) {
    if (res.status !== 200) {
        message.destroy();
        message.error(errorMessages(res));
        return Promise.reject(new Error(errorMessages(res)));
    }
    return res;
}

function checkData (json) {
    switch (json.code) {
    case 703:
        return check703(json);
    case -1:
        message.destroy();
        message.error(`${json.code} ${json.message || json.data}`);
        return Promise.reject(new Error(`${json.code} ${json.message || json.data}`));
    }
    return json;
}

function commonCatch (error) {
    // TODO：具体逻辑待实现
    console.error('request failed：', error);
    return {error}
}

const api = {
    fetch: function (url, params = {}, method = 'GET', type = '', mock = false) {
        const token = Cookies.get('token');
        const headers = { token };
        mock && delete headers['token'];
        if (type !== 'file') {
            headers['Content-Type'] = (type === 'json' ? 'application/json' : 'application/x-www-form-urlencoded') + '; charset=UTF-8';
        }

        if (type === 'file') {
            delete headers['Content-Type'];
        }

        let options = {
            method: method,
            headers: headers,
            credentials: 'include'
        };

        if (type === 'file') {
            options.body = params;
        } else if (type === 'json') {
            options.body = JSON.stringify(params);
        } else if (method !== 'GET') {
            options.body = qs.stringify(params);
        }
        let otherReject;
        new Promise((resolve, reject) => { otherReject = reject })
            .catch((error) => {
                // TODO：处理业务中不处理的错误
                return commonCatch(error);
            });
        return fetch(url, options)
            .then(checkRes)
            .then(res => res.text())
            .then(text => text ? JSON.parse(text) : {})
            .then(checkData)
            .then(function (json) {
                json.reject = otherReject;
                return json;
            })
            .catch((error) => {
                // TODO：处理来自本promise的错误
                return commonCatch(error);
            });
    },

    get: function (url, params = {}, mock = false) {
        let cacheUrl = url;
        if (!isEmpty(params)) {
            cacheUrl = url + (/\?/.test(url) ? '&' : '?') + qs.stringify(params)
        }
        return this.fetch(cacheUrl, {}, 'GET', '', mock);
    },

    post: function (url, params, type = '', mock = false) {
        return this.fetch(url, params, 'POST', type, mock);
    },

    put: function (url, params, type = '') {
        return this.fetch(url, params, 'PUT', type);
    },

    delete: function (url, params = {}, type = '') {
        let cacheUrl = url;
        if (!isEmpty(params)) {
            cacheUrl = url + (/\?/.test(url) ? '&' : '?') + qs.stringify(params)
        }
        return this.fetch(cacheUrl, params, 'DELETE', type);
    }
};

export default api;
