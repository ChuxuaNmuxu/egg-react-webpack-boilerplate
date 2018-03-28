/**
 * Created by 万叙杰 on 2017/8/5.
 */
import { combineReducers } from 'redux';

import myCourse from './myCourse';
import schoolCourse from './schoolCourse';

const courseEntry = combineReducers({
    myCourse,
    schoolCourse
});

export default courseEntry;
