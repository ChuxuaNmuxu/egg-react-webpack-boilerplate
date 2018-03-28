/**
 * 用户/学校 课件数据接口
 * @author Ouyang
 * */
import Http from '../../utils/api';
import Helper from '../../../config/helper';

const SITE_NAME = 'CJCMS';
const SUCCESS = 0;

/**
 * 请求课件资源地址
 * @param id    课件Id
 * */
export async function fetchCourseWareUrl (id) {
    const url = Helper.apiResolve(SITE_NAME, `api/user/coursewares/${id}/download`);
    const { code, data } = await Http.post(url);
    if (code === SUCCESS) {
        return { data: {url: data.url, size: data.size} };
    }
    return { message: `请求课件资源失败:${data.message}` }
}
