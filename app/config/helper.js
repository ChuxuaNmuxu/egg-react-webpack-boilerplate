const path = require('path');
const url = require('url');
const merge = require('lodash/merge');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const Cookies = require('js-cookie');

const config = require('./config');
const Utils = require('../web/utils');

/**
 * 基于配置的帮助类
 */
let Helper;

function pathResolve () {
    const args = [config.root].concat([].slice.call(arguments))
    return path.resolve.apply(path, args)
}

/**
 * 路径处理
 * @example
 * Helper.pathResolve.root();               // => '/'
 * Helper.pathResolve.root('dir1');         // => '/dir1'
 * Helper.pathResolve.src();                // => '/src'
 * Helper.pathResolve.src('dir1');          // => '/src/dir1'
 * Helper.pathResolve.components();         // => '/src/components'
 * Helper.pathResolve.components('dir1');   // => '/src/components/dir1'
 */
const pathResolves = {
    root: pathResolve,
    src: pathResolve.bind(null, config.dir_src),
    dist: pathResolve.bind(null, config.dir_dist),
    components: pathResolve.bind(null, config.dir_components),
    libs: pathResolve.bind(null, config.dir_libs)
};

/**
 * api链接处理
 * @param {string} siteName
 * @param {string} pathname - 路径，必输
 * @param {object} query - 查询参数
 * @example
 * Helper.apiResolve('current', 'aaa') // => 'http://xxx-api.ecaicn.com/aaa'
 * Helper.apiResolve('cjhms', 'aaa') // => 'http://cjhms-api.ecaicn.com/aaa'
 * Helper.apiResolve('cjhms', 'aaa', {id: 1}) // => 'http://cjhms-api.ecaicn.com/aaa?id=1'
 */
const apiResolve = (siteName, pathname, query = {}) => {
    if (!pathname) {
        return '';
    }
    siteName = siteName && siteName.toLowerCase();
    const {protocol, api} = siteName && siteName !== 'current' ? config.site[siteName] : config.info;
    const apiPath = api ? url.format({
        protocol: protocol || config.protocol,
        host: api,
        pathname,
        query
    }) : '';
    return apiPath;
};

/**
 * 站点链接处理
 * @param {string} siteName
 * @param {string} pathname - 路径
 * @param {object} query - 查询参数
 * @example
 * // 返回当前站点链接
 * Helper.siteResolve() // => 'http://xxx.ecaicn.com'
 * Helper.siteResolve('current') // => 'http://xxx.ecaicn.com'
 * Helper.siteResolve('current', 'aaa') // => 'http://xxx.ecaicn.com/aaa'
 * Helper.siteResolve('current', 'aaa', {id: 1}) // => 'http://xxx.ecaicn.com/aaa?id=1'
 * // 返回cjhms项目站点链接
 * Helper.siteResolve('cjhms') // => 'http://cjhms.ecaicn.com'
 * Helper.siteResolve('cjhms', 'aaa') // => 'http://cjhms.ecaicn.com/aaa'
 * Helper.siteResolve('cjhms', 'aaa', {id: 1}) // => 'http://cjhms.ecaicn.com/aaa?id=1'
 */
const siteResolve = (siteName, pathname = '', query = {}) => {
    const site = getSiteInfo(siteName);
    const {protocol, host, port} = site;
    pathname = pathname && (siteName && siteName !== 'current' ? pathname : (path.posix || path).join(config.dir_deploy, pathname));
    const fmt = {
        protocol: protocol,
        hostname: host,
        port: [80, 443].indexOf(port) > -1 ? '' : port
    }
    pathname && (fmt['pathname'] = pathname);
    isEmpty(query) || (fmt['query'] = query);
    const sitePath = url.format(fmt);
    return sitePath;
};

/**
 * 站内链接处理
 * @param {string} pathname - 路径
 * @param {object} query - 查询参数
 * @example
 * Helper.urlResolve()                  // => '首页'
 * Helper.urlResolve('analysis/student')// => '学生分析首页'
 * Helper.urlResolve('analysis/student', {id: 1}) // => '学生分析首页带参数'
 */
const urlResolve = (pathname = '', query = {}) => {
    return url.format({
        pathname: (path.posix || path).join(config.dir_deploy, pathname),
        query
    });
};

/**
 * 获取站点完整信息
 * @param {string|object} site 站点信息
 */
const getSiteInfo = (site) => {
    if (typeof site === 'string') {
        site = site !== 'current' ? config.site[site.toLowerCase()] : config.info;
    } else {
        site = merge({}, site || config.info);
        site = site.name ? merge({}, config.site[site.name.toLowerCase()], site) : site;
    }
    // 协议
    site.protocol = site.protocol || config.protocol || 'https';
    // 端口
    if (!site.port || [80, 443].indexOf(site.port) > -1) {
        site.port = site.protocol === 'https' ? 443 : 80;
    }
    return site;
};

/**
 * 判断是否共享cookie
 * @param {*} siteA
 * @param {*} siteB
 */
const isShareCookie = (siteA, siteB) => {
    siteA = getSiteInfo(siteA);
    siteB = getSiteInfo(siteB);
    return Utils.isTopLevelDomainEqual(siteA.host, siteB.host);
};

/**
 * 判断是否需要登录通知
 * @param {string|object} site 站点信息
 */
const isNeedNotifyLogin = (site) => {
    if (!site.needLogin) {
        return false;
    }
    // 判断是不是同协调、同域和同端口
    return !isShareCookie(site, config.info);
};

/**
 * 登录通知
 * 需要登录且非同域站点需要通知
 */
const notifyLogin = (type) => {
    type = type || 'login';
    const token = Cookies.get('token');
    const visitor = Cookies.get('visitor');
    map(config.site, (site) => {
        if (!isNeedNotifyLogin(site)) {
            return;
        }
        // TODO: 判断是不是同域和同端口
        let ifm = document.createElement('iframe');
        ifm.style.display = 'none';
        ifm.src = siteResolve(site.name.toLowerCase(), `account/${type}`, type === 'login' && {
            t: token,
            u: visitor
        });
        ifm.onload = () => {
            setTimeout(ifm.remove(), 1000);
        }
        document.body.appendChild(ifm);
    })
}

let SiteHelper = {
    getSiteInfo,
    isShareCookie,
    isNeedNotifyLogin,
    notifyLogin
}

Helper = {
    pathResolves,
    apiResolve,
    siteResolve,
    urlResolve,
    SiteHelper
}

module.exports = Helper;
