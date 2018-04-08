const Cookies = require('js-cookie');
const url = require('url');
const forEach = require('lodash/forEach');
const merge = require('lodash/merge');
const fetch = require('isomorphic-fetch');

const regIp = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
/**
 * 存放独立的工具函数
 */
const utils = {
    /**
     * 判断是不是IP
     */
    isIp: function (hostname) {
        return regIp.test(hostname);
    },

    /**
     * 获取顶级域名
     */
    getTopLevelDomain: function (link) {
        link = link || window.location.href;
        let hostname = url.parse(link).hostname || link;
        if (this.isIp(hostname) || hostname.match(/\./g).length < 2) {
            return hostname;
        }
        var regex = /([^]*).*/;
        var match = hostname.match(regex);
        if (typeof match !== 'undefined' && match !== null) hostname = match[1];
        if (typeof hostname !== 'undefined' && hostname !== null) {
            var strAry = hostname.split('.');
            if (strAry.length > 1) {
                hostname = strAry[strAry.length - 2] + '.' + strAry[strAry.length - 1];
            }
        }
        return hostname;
    },

    /**
     * 在顶级域名上设置cookie
     */
    setTopLevelCookie: function (name, value, options = {}) {
        const topLevelDomain = this.getTopLevelDomain();
        const defaultOpts = {
            domain: topLevelDomain,
            expires: 1
        };
        options = merge({}, defaultOpts, options);
        Cookies.set(name, value, options);
    },

    /**
     * 移除顶级域名上的cookie
     */
    removeTopLevelCookie: function (name) {
        const topLevelDomain = this.getTopLevelDomain();
        Cookies.remove(name, {
            domain: topLevelDomain
        });
    },

    /**
     * 移除所有cookie，包含顶级域名上的cookie
     */
    removeAllCookies: function () {
        const topLevelDomain = this.getTopLevelDomain();
        forEach(Cookies.get(), (value, key) => {
            Cookies.remove(key);
            Cookies.remove(key, {
                domain: topLevelDomain
            });
        })
    },

    /**
     * 判断2个连接顶级域名是否相同
     */
    isTopLevelDomainEqual: function (link1, link2) {
        return this.getTopLevelDomain(link1) === this.getTopLevelDomain(link2)
    },

    /**
     * 上传至阿里云
     */
    uploadImgToAli: (url, imgFile, data) => {
        const post = (file) => {
            var fd = new FormData();
            forEach(data, (value, key) => {
                fd.append(key, value)
            })
            fd.append('file', file, 'image.jpg');

            const options = {
                method: 'POST',
                body: fd
            };

            return fetch(url, options)
            .then(res => res.text())
            .then(text => text ? JSON.parse(text) : {})
        }

        // canvas
        if (imgFile.toDataURL) {
            return new Promise((resolve, reject) => {
                imgFile.toBlob(blob => {
                    // const fd = updateImg(data, blob);
                    post(blob)
                    .then(res => {
                        if (res.data) {
                            resolve(res.data)
                        } else {
                            reject(new Error(res.error))
                        }
                    })
                }, 'image/jpeg')
            }).catch(error => {
                throw new Error(error);
            })
        } else { // 剪切板等中获取的文件
            // const fd = updateImg(data, imgFile);
            return post(imgFile)
            .then(res => {
                return res.data
            })
            .catch(error => {
                throw new Error(error);
            })
        }
    },

    /**
     * 创建模板Reducer
     * */
    createReducer: (initialState, handles) => {
        return function reducer (state = initialState, action) {
            if (handles.hasOwnProperty(action.type)) {
                return handles[action.type](state, action);
            }
            return state;
        }
    }
};

// module.exports = utils;
export default utils;
