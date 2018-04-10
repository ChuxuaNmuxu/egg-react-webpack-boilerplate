/**
 * jsdom @https://github.com/jsdom/jsdom
 * 在服务器端模拟浏览器环境，可以运行引用浏览器api的第三方库
 */
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`...`);
global.window = window;
global.document = window.document;
global.navigator = window.navigator;

module.exports = app => {};
