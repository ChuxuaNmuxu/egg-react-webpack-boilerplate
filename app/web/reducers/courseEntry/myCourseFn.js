/**
 * 用户课件数据合并逻辑
 * @author Ouyang
 * */
// import * as Lodash from 'lodash';

export const UPDATE_DOWNLOAD_MODAL = (state, action) => {
    const { url = '', size = 0, visible } = action.data;
    return Object.assign({}, state, {
        downLoadModal: {
            visible: visible,
            resource: url,
            size: size
        }
    });
}

// 更新课件列表数据
export const UPDATE_COURSEWARE_LIST = (state, action) => {
    return Object.assign({}, state, { list: action.json });
}

// 更新搜索文件名数据
export const UPDATE_SEARCH_LABEL_VALUE = (state, action) => {
    return Object.assign({}, state, { searchValue: action.data });
}

// 更新文件夹列表数据
export const UPDATE_FOLDER_LIST = (state, action) => {
    return Object.assign({}, state, { myFolderData: action.data });
}
