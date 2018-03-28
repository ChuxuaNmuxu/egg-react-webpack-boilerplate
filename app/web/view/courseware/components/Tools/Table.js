import React from 'react';
import {connect} from 'react-redux';
import {fromJS} from 'immutable';
import PropTypes from 'prop-types';

import TableSelector from './TableSelector';
import {addBlock} from '../../../../actions/courseware';

class Table extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            modelVisible: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick () {
        this.setState({
            modelVisible: !this.state.modelVisible
        })
    }

    render () {
        return <div className=' fl tool-btn table' onClick={this.handleClick}>
            <div className='tools-icon table-icon' data-type='text'><i className='iconfont icon-biaoge1' /></div>
            <div className='tools-title'data-type='table'>表格</div>
            <TableSelector handleVisible={this.handleClick} visible={this.state.modelVisible} selectTable={this.props.addBlock} />
        </div>
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addBlock: (row, column) => {
            dispatch(addBlock(fromJS({
                blockType: 'table',
                row,
                column
            })))
        }
    }
}

Table.propTypes = {
    addBlock: PropTypes.func
}

export default connect(null, mapDispatchToProps)(Table);
