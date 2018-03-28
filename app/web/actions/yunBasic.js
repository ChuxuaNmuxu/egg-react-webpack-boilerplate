/**
 * Created by 万叙杰 on 2017/8/10.
 */
// 存放云基础平台请求
import api from '../utils/api';
import config from '../../config';

export const fetchAllGrade = (schoolId) => {
    return () => {
        return api.get(config.apiResolve('cjyun', 'school/' + schoolId + '/gradeList'))
    }
}

export const fetchAllSubject = (schoolId) => {
    return () => {
        return api.get(config.apiResolve('cjyun', 'schoolSubject/list'), {schoolId: schoolId})
    }
}
