import api from '../utils/api';
import config from '../../config';

// 进入play 页面的请求
export const coursePlayGetData = (coursewareId) => {
    return (dispatch, getState) => {
        // const params = search;
        console.log(coursewareId);
        // return api.get('http://rapapi.org/mockjsdata/14656/courseEntryData', pagination, true);
        return api.get(config.apiResolve('current', `/api/user/coursewares/${coursewareId}`));
    }
}
