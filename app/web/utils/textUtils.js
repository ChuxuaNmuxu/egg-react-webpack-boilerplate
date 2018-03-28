/**
 * 字符串文本过滤工具集合
 * */

class TextUtils {
    /** 过滤ReactComponent key中'.$' */
    static format$Prefix (value = '') {
        return value.replace(/([.$]*)/g, '');
    }
    /** 下载文件大小单位转换 */
    static byteToSize (value) {
        if (value === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(value) / Math.log(k));
        return (value / Math.pow(k, i)).toPrecision(3) + sizes[i];
    }
}

export default TextUtils;
