import React from 'react';
import Block from '../Block';
import PropTypes from 'prop-types';
import {Map, fromJS} from 'immutable';
import ReactDOM from 'react-dom';

import Td from './Td';
// import DispatchAfterResize from '../DispatchAfterResize/DispatchAfterResize';
import {handleSaveTableContentAndHTML, tableResize} from '../../../../../actions/courseware'

/**
 * 表格元素块
 */

const tableBlock = 'off';

class TableBlock extends React.Component {
    constructor (props) {
        super(props);

        this.handleTableChange = this.handleTableChange.bind(this);
        // this.handleTableResize = this.handleTableResize.bind(this);
    }

    handleTableChange (index, content) { // 保存table的html，高度,td的内容
        const {dispatch} = this.props;
        index = fromJS(index);
        const table = ReactDOM.findDOMNode(this.table);
        dispatch(handleSaveTableContentAndHTML(Map({ // 保存table的html, td的内容
            index: index,
            HTML: table.innerHTML,
            content: content
        })))
    }

    // handleTableResize () {
    // }

    // shouldComponentUpdate (nextProps, nextState) {
    //     console.log(12, nextProps.me.get('tableArr').toJS());
    //     console.log(13, this.props.me.get('tableArr').toJS());

    //     console.log(nextProps.me.get('tableArr') === this.props.me.get('tableArr'));
    //     return nextProps.me.get('tableArr') !== this.props.me.get('tableArr')
    // }

    componentWillReceiveProps (nextProps) {
        const {dispatch, me: next, index, groupIndex} = nextProps;
        const {me: prev} = this.props;
        const table = ReactDOM.findDOMNode(this.table);
        const heightChange = (next.get('content') !== prev.get('content') || next.getIn(['props', 'row']) !== prev.getIn(['props', 'row'])) && next.getIn(['props', 'size', 'height']) !== table.offsetHeight;
        if (heightChange) { // 保存table高度
            dispatch(tableResize(Map({
                index: index,
                groupIndex: groupIndex,
                height: table.offsetHeight
            })))
        }
    }

    render () {
        const {index, groupIndex, me, dispatch} = this.props;
        let tableArr = me.get('tableArr');
        if (tableBlock === 'off') {
            return <Block {...this.props}>
                <div dangerouslySetInnerHTML={{__html: me.get('content')}} className='table-block' />
            </Block>
        }

        return (
            <Block {...this.props}>
                <div ref={e => { this.table = e }}>
                    <table
                      className='table-block'
                      data-type='table'
                        >
                        <tBody>
                            {
                                tableArr.map((th, rowIndex) => {
                                    return <tr key={rowIndex}>{th.map((td, columnIndex) => <Td key={columnIndex} index={{rowIndex, columnIndex, index, groupIndex}} content={td} handleTableChange={this.handleTableChange} me={me} dispatch={dispatch} />)}</tr>
                                })
                            }
                        </tBody>
                    </table>
                </div>
            </Block>
        )
    }
}

TableBlock.propTypes = {
    props: PropTypes.object,
    me: PropTypes.object,
    index: PropTypes.number,
    dispatch: PropTypes.func,
    groupIndex: PropTypes.number
}

export default TableBlock;
