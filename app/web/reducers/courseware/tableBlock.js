/**
 * 表格元素处理逻辑
 */
import {fromJS, List, Map} from 'immutable';

import {
    getTheBlock,
    updatePickedBlocks
} from './helper';
import {TD_WIDTH} from '../../view/courseware/config/constant';

/**
 * 表格的快捷键操作
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleTalbeQuickOption = (courseware, action) => {
    let {data} = action;
    data = fromJS(data);

    const columnIndex = data.get('columnIndex');
    const rowIndex = data.get('rowIndex');
    const currentTable = getTheBlock(courseware);
    const maxColumn = parseInt(currentTable.getIn(['props', 'size', 'width']) / TD_WIDTH); // 因为table的宽度是确定的，td最小宽度40计算得最大的列数
    const tableArr = currentTable.get('tableArr');
    const rowCount = tableArr.size;
    const columnCount = tableArr.get(0).size;

    let handleOption = tableArr => tableArr;
    switch (data.get('option')) {
    case 'addRow': // 增加行
        handleOption = () => {
            if (rowCount < 20) {
                return tableArr.splice(rowIndex + 1, 0, List().setSize(columnCount))
            }
            return tableArr
        }
        break;
    case 'deleteRow': // 删除当前行
        handleOption = () => {
            if (rowCount > 1) {
                return tableArr.splice(rowIndex, 1);
            }
            return tableArr;
        }
        break;
    case 'addColumn': // 增加列
        handleOption = () => {
            if (columnCount < maxColumn && columnCount < 20) {
                return tableArr.map((tr) => {
                    return tr.splice(columnIndex + 1, 0, '')
                });
            }
            return tableArr;
        }
        break;
    case 'deleteColumn': // 删除当前行
        handleOption = () => {
            if (columnCount > 1) {
                return tableArr.map((tr) => {
                    return tr.splice(columnIndex, 1)
                });
            }
            return tableArr;
        }
        break;
    }

    return updatePickedBlocks(courseware, handleOption, ['tableArr']);
}

/**
 * 右边栏改变table的行列
 * @param {object} courseware 课件数据
 */
const changeTableRanks = (courseware, action) => {
    let {data} = action;
    const rank = data.get('rank'); // 行：row; 列：column
    const value = parseInt(data.get('value')); // 将更改到行数或列数
    let handleOption = tableArr => tableArr;
    if (value > 0) { // 设置行列数
        if (rank === 'column') {
            handleOption = (tableArr) => {
                return tableArr.map(tr => tr.setSize(value))
            }
        } else if (rank === 'row') {
            handleOption = tableArr => {
                return tableArr.setSize(value).map(tr => {
                    if (!tr) { // 将undefined转换成数组
                        return List().setSize(tableArr.get(0).size)
                    }
                    return tr
                })
            }
        }
    }

    return updatePickedBlocks(courseware, handleOption, ['tableArr']);
}

/**
 * 表格自适应高度
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const handleTableResize = (courseware, action) => {
    let {data} = action;
    return updatePickedBlocks(courseware, () => data.get('height'), ['props', 'size', 'height'], Map({
        index: data.get('index'),
        groupIndex: data.get('groupIndex')
    }));
}

/**
 * 添加表格时初始化表格的conntent属性
 * @param {object} courseware 课件数据
 * @param {object} action action对象
 */
const initialTableHtml = (rows, cols) => {
    let content = '';
    let tds = '';
    let trs = '';
    for (let i = 0; i < cols; i++) {
        tds += '<td></td>';
    }
    for (let i = 0; i < rows; i++) {
        trs += `<tr>${tds}</tr>`;
    }
    content = `<table><tbody>${trs}</tboby></table>`;
    return content;
}

/**
 * 保存table的html, td的内容
 * @param {*Map} courseware 课件数据
 * @param {*Map} action
 */
const handleSaveTableContentAndHTML = (courseware, action) => {
    const {data} = action;
    const index = data.get('index');
    const rowIndex = index.get('rowIndex');
    const columnIndex = index.get('columnIndex');
    const HTML = data.get('HTML');
    const content = data.get('content');

    courseware = updatePickedBlocks(courseware, () => HTML, ['content'], index);
    courseware = updatePickedBlocks(courseware, () => content, ['tableArr', rowIndex, columnIndex], index);

    return courseware;
}

export {
    handleTalbeQuickOption,
    changeTableRanks,
    handleTableResize,
    initialTableHtml,
    handleSaveTableContentAndHTML
}
