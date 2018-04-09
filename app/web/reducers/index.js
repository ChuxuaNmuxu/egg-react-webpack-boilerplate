import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import account from './account';
// import course from './course';
import courseware from './courseware/';
import courseEntry from './courseEntry';
import hamster from './hamster';

/**
 * 用来测试reducer的耗费时间
 * @param {*} reducers 全部的reducer
 * @param {*} thresholdInMs 毫秒数
 */
function logSlowReducers (reducers, thresholdInMs = 5) {
    Object.keys(reducers).forEach((name) => {
        const reducer = reducers[name];
        // 将每个reducer 用高阶函数包装
        reducers[name] = (state, action) => {
            const start = Date.now();
            const result = reducer(state, action);
            const diffInMs = Date.now() - start;
            if (diffInMs >= thresholdInMs) {
                console.warn(` Reducer:${name} 里 action.type 为 ${action.type} 的数据操作耗费了 ${diffInMs} ms哦！`);
            }
            return result;
        };
    });
    return reducers;
}

let reducers = {
    account,
    // course,
    courseware,
    // routing,
    courseEntry,
    hamster
};
if (process.env.NODE_ENV !== 'production') {
    reducers = logSlowReducers(reducers);
}
const rootReducer = combineReducers(reducers);

export default rootReducer;
