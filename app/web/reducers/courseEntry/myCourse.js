/**
 * Created by 万叙杰 on 2017/8/5.
 */
import * as ActionTypes from '../../actions/actionTypes';
import * as Fn from './myCourseFn';
import Utils from '../../utils';

const initialState = {
    list: {
        data: [],
        message: '',
        page: 1,
        pageSize: 10,
        total: null,
        totalPages: null
    },
    // 下载Modal
    downLoadModal: {
        visible: false,
        resource: '',
        size: 0
    },
    searchValue: '',
    myFolderData: []
};

const handles = {
    [ActionTypes.UPDATE_DOWNLOAD_MODAL]: Fn.UPDATE_DOWNLOAD_MODAL,
    [ActionTypes.UPDATE_SEARCH_LABEL]: Fn.UPDATE_SEARCH_LABEL_VALUE,
    [ActionTypes.UPDATE_FOLDER_LIST]: Fn.UPDATE_FOLDER_LIST,
    [ActionTypes.FETCHMYCOURSELIST_SUCCESS]: Fn.UPDATE_COURSEWARE_LIST
};

// const myCourse = (state = initialState, action) => {
//     let type = action.type;
//     switch (type) {
//     case ActionTypes.FETCHMYCOURSELIST_SUCCESS:
//         return Object.assign({}, state, {
//             list: action.json
//         });
//     case 'SAVE_SEARCH_VALUE':
//         return Object.assign({}, state, {
//             searchValue: action.data
//         })
//     case 'SAVE_MY_FOLDER_DATA':
//         return Object.assign({}, state, {
//             myFolderData: action.data
//         })
//     default:
//         return state;
//     }
// }

export default Utils.createReducer(initialState, handles);
