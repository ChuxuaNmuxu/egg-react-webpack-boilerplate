/**
 * Created by 万叙杰 on 2017/8/7.
 */
import * as actionTypes from '../../actions/actionTypes';

const initialState = {
    list: {
        data: [],
        message: '',
        page: 1,
        pageSize: 10,
        total: null,
        totalPages: null
    },
    searchValue: ''
};

const schoolCourse = (state = initialState, action) => {
    let type = action.type;
    switch (type) {
    case actionTypes.FETCHSCHOOLCOURSELIST_SUCCESS:
        return Object.assign({}, state, {
            list: action.json
        });
    case 'SAVE_SCHOOL_SEARCH_VALUE':
        return Object.assign({}, state, {
            searchValue: action.data
        })
    default:
        return state;
    }
}

export default schoolCourse;
