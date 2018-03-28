import React, {Component} from 'react';
import {Form, Col} from 'antd';
import PropTypes from 'prop-types';
import {Map} from 'immutable';

import {groupAlign} from '../../../../actions/courseware';
const FormItem = Form.Item;

class GroupProps extends Component {
    constructor (props) {
        super(props);

        this.handleAlign = this.handleAlign.bind(this);
    }

    handleAlign (e) {
        const {dispatch} = this.props;
        dispatch(groupAlign(Map({
            position: e.target.dataset.align
        })))
    }

    render () {
        return <div>
            <FormItem label='水平对齐'>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-Align-Left' onClick={this.handleAlign} data-align='left' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-Align-Center' onClick={this.handleAlign} data-align='center' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-Align-Right' onClick={this.handleAlign} data-align='right' />
                    </div>
                </Col>
            </FormItem>
            <FormItem label='垂直对齐'>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-aligntop' onClick={this.handleAlign} data-align='top' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-verticalaligncenter' onClick={this.handleAlign} data-align='middle' />
                    </div>
                </Col>
                <Col span='4'>
                    <div className='align'>
                        <i className='iconfont icon-alignbottom' onClick={this.handleAlign} data-align='bottom' />
                    </div>
                </Col>
            </FormItem>
        </div>
    }
}

GroupProps.propTypes = {
    dispatch: PropTypes.func
}

export default GroupProps;
