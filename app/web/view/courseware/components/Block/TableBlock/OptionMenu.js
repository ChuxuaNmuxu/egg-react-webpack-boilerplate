import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import {Menu} from 'antd';
import {replace} from 'lodash';
import {Map} from 'immutable';

import styles from './OptionMenu.scss';
import {tableOption} from '../../../../../actions/courseware';
import {hideContextMenu} from '../../../../../components/ContextMenu';

class OptionMenu extends Component {
    constructor (props) {
        super(props);
        this.handleContextMenuClick = this.handleContextMenuClick.bind(this);
    }

    handleContextMenuClick (e) {
        hideContextMenu();

        const {dispatch, index: {columnIndex, rowIndex, tableIndex}} = this.props;
        console.log('popvoer')
        dispatch(tableOption(Map({
            columnIndex,
            rowIndex,
            tableIndex,
            option: replace(e.key, '.$', '')
        })))
    }

    render () {
        return (
            <Menu styleName='option-menu' onClick={this.handleContextMenuClick}>
                <Menu.Item key='addRow'>增加行</Menu.Item>
                <Menu.Item key='addColumn'>增加列</Menu.Item>
                <Menu.Divider />
                <Menu.Item key='deleteRow'>删除此行</Menu.Item>
                <Menu.Item key='deleteColumn'>删除此列</Menu.Item>
            </Menu>
        )
    }
}

OptionMenu.propTypes = {
    dispatch: PropTypes.func,
    index: PropTypes.object,
    handleRankChange: PropTypes.func,
    tableOption: PropTypes.func
}

export default CSSModules(OptionMenu, styles);
