import React, {Component} from 'react';
import {Form, Input, Col} from 'antd';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Map} from 'immutable';

import {changeTableRow, changeTableColumn} from '../../../../actions/courseware';
import {getTheBlock} from '../../../../reducers/courseware/helper';
const FormItem = Form.Item;

class TableProps extends Component {
    constructor (props) {
        super(props);

        this.handleChangeColumn = this.handleChangeColumn.bind(this);
        this.handleChangeRow = this.handleChangeRow.bind(this);
    }

    handleChangeRow (e) {
        const {dispatch} = this.props;
        dispatch(changeTableRow(Map({
            value: e.target.value,
            rank: 'row'
        })))
    }

    handleChangeColumn (e) {
        const {dispatch} = this.props;
        dispatch(changeTableColumn(Map({
            value: e.target.value,
            rank: 'column'
        })))
    }

    render () {
        const formItemProps = {
            colon: false
        }

        const {courseware} = this.props;
        // const block = getFocusedBlock(courseware);
        // const {tableArr} = block;
        const tableArr = getTheBlock(courseware).get('tableArr');

        return <div>
            <Col span='8' offset='1' className='clearfix'>
                <span className='fontColorWhite'>行</span>
            </Col>
            <Col span='8' offset='3' className='clearfix'>
                <span className='fontColorWhite'>列</span>
            </Col>
            <FormItem {...formItemProps}>
                <Col span='8'>
                    <FormItem
                      {...formItemProps}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 15 }}>
                        <Input size='small' onChange={this.handleChangeRow} value={tableArr.size} />
                    </FormItem>
                </Col>
                <Col span='3' className='wordX'>
                    <span className='fontColorWhite'>X</span>
                </Col>
                <Col span='8'>
                    <FormItem
                      {...formItemProps}
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 15 }}>
                        <Input size='small' onChange={this.handleChangeColumn} value={tableArr.get(0).size} />
                    </FormItem>
                </Col>
            </FormItem>
            {/* <FormItem {...formItemProps} label='水平对齐'>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-Align-Left' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-Align-Center' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-Align-Right' />
                    </div>
                </Col>
            </FormItem>
            <FormItem {...formItemProps} label='垂直对齐'>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-aligntop' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-verticalaligncenter' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-alignbottom' />
                    </div>
                </Col>
            </FormItem> */}
        </div>
    }
}

const mapStateToProps = (state) => {
    const courseware = state.courseware.present;
    return {
        courseware
    }
}

TableProps.propTypes = {
    dispatch: PropTypes.func,
    form: PropTypes.object,
    courseware: PropTypes.object
}

export default connect(mapStateToProps)(TableProps);
