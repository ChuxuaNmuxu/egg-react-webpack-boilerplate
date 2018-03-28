import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import styles from './TableOptionMenu.scss';
import {tableOption} from '../../../../actions/courseware'

class OptionMenu extends Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (e) {
        const {dispatch, index: {columnIndex, rowIndex, tableIndex}, handleRankChange} = this.props;
        console.log('popvoer')
        dispatch(tableOption({
            columnIndex,
            rowIndex,
            tableIndex,
            option: e.target.dataset.option
        }))
        handleRankChange();
    }

    render () {
        return (
            <div styleName='optionMenu' onMouseDown={this.handleClick}>
                <p data-option='addRow'>增加行</p>
                <p data-option='addColumn'>增加列</p>
                <div className='hr' />
                <p data-option='deleteRow'>删除此行</p>
                <p data-option='deleteColumn'>删除此列</p>
            </div>
        )
    }
}

OptionMenu.propTypes = {
    dispatch: PropTypes.func,
    index: PropTypes.object,
    handleRankChange: PropTypes.func
}

export default connect()(CSSModules(OptionMenu, styles));
