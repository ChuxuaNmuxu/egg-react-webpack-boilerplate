/**
 * 一些全局的处理逻辑
 */
import initialState from '../initialState';
import {refreshIndex, refreshZindex} from './helper';
import {fromJS, Map} from 'immutable'

import transfrom from '../../view/courseware/components/DataTransfrom'

/**
 * 获取数据
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleGetData = (courseware, action) => {
    // action = fromJS(action);
    const {payload: {data: {ppt, title}}} = action;
    // const data = action.getIn(['payload', 'data']);
    courseware = courseware.mergeDeep(Map({
        ppt: transfrom(ppt, 'immutable'),
        title: title,
        current: Map({
            stateTransformed: true // false: 数据已经经过出来，不在是初始化数据
        })
    }))

    // 创建课件的运行时状态
    courseware = refreshZindex(courseware);
    courseware = refreshIndex(courseware);
    return courseware
}

/**
 * 更改课件的名称
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleChangeTitle = (courseware, action) => {
    const {name} = action;
    return courseware.set('title', name);
}

/**
 * 退出初始化数据
 */
const unmountInitState = () => {
    return fromJS(initialState.courseware);
}

export {
    handleGetData,
    handleChangeTitle,
    unmountInitState
}
