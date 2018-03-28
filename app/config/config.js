const path = require('path');
const url = require('url');
const merge = require('lodash/merge');

const _root = path.resolve(__dirname, '../');
let site;
if (process.env.NODE_ENV === 'develoption') {
    site = require('./site.local.config');
} else {
    site = require('./site.config');
}

function pathResolve () {
    const args = [_root].concat([].slice.call(arguments))
    return path.resolve.apply(path, args)
}

const config = {
    // 站点信息
    info: {                         // 对于存在于site列表中的项目，可只配置站点名称，其它值则会从site列表中取，但这里的配置项目优化级较高
        name: 'CJCMS'
    },

    protocol: 'https',

    root: _root, // 站点根目录
    dir_src: path.join(_root, 'src'), // 开发目录
    dir_dist: path.join(_root, 'dist'), // 部署目录
    dir_components: path.join(_root, 'src/components'), // 组件目录
    dir_libs: path.join(_root, 'libs'), // 打包库目录
    dir_deploy: '/', // 部署目录

    // 站点列表
    site: site,

    // 通用扩展类库，这部分库会被预编译
    vendors: [
        'react',
        'react-redux',
        'react-router',
        'redux',
        'react-dom'
    ]
};

// 处理站点信息
const siteName = config.info && config.info.name;
if (!siteName) {
    throw new Error('config.info.name 不能为空！');
}
const siteConfig = config.site[siteName.toLowerCase()] || {};
config.info = merge({}, siteConfig, config.info);

/**
 * 路径处理
 * @deprecated 弃用，请移步至Helper.pathResolves
 */
config.pathResolve = {
    root: pathResolve,
    src: pathResolve.bind(null, config.dir_src),
    dist: pathResolve.bind(null, config.dir_dist),
    components: pathResolve.bind(null, config.dir_components),
    libs: pathResolve.bind(null, config.dir_libs)
};

/**
 * api链接处理
 * @deprecated 弃用，请移步至Helper.apiResolve
 */
config.apiResolve = (siteName, pathname, query = {}) => {
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
 * @deprecated 弃用，请移步至Helper.siteResolve
 */
config.siteResolve = (siteName, pathname = '', query = {}) => {
    siteName = siteName && siteName.toLowerCase();
    const {protocol, host, port} = siteName && siteName !== 'current' ? config.site[siteName] : config.info;
    pathname = siteName && siteName !== 'current' ? pathname : (path.posix || path).join(config.dir_deploy, pathname);
    const sitePath = url.format({
        protocol: protocol || config.protocol,
        hostname: host,
        port: port === 80 ? '' : port,
        pathname,
        query
    });
    return sitePath;
};

/**
 * 站内链接处理
 * @deprecated 弃用，请移步至Helper.urlResolve
 */
config.urlResolve = (pathname = '', query = {}) => {
    return url.format({
        pathname: path.join(config.dir_deploy, pathname),
        query
    });
};

module.exports = config;
