import React, {Component} from 'react';
import Color from './PropsComponents/Color';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Form, Col} from 'antd';
import {fromJS} from 'immutable';

import {getTheBlock} from '../../../../reducers/courseware/helper'
import ShapeSelector from '../Tools/ShapeSelector'
import {changeShapeType} from '../../../../actions/courseware';
import shapes from '../Block/ShapeBlock/ShapeSvg';
const FormItem = Form.Item;

class ShapeProps extends Component {
    constructor (props) {
        super(props);

        this.state = {
            modelVisible: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    // 控制形状Modal的显示隐藏
    handleClick () {
        this.setState({
            modelVisible: !this.state.modelVisible
        });
    }

    render () {
        const formItemProps = {
            colon: false
        }
        const {courseware} = this.props;
        const block = getTheBlock(courseware);
        const ShapeComponent = shapes[block.get('shapeType')];
        return <div>
            <FormItem {...formItemProps} label='更换形状'>
                <Col span='10' offset='7' className='clearfix'>
                    <div onClick={this.handleClick}>
                        <ShapeComponent />
                    </div>
                </Col>
                <ShapeSelector
                  handleVisible={this.handleClick}
                  visible={this.state.modelVisible}
                  addBlock={this.props.changeShapeType}
                />
            </FormItem>
            <hr className='divider' />
            <Color type='color' form={this.props.form} className='transportSetting' />
        </div>
    }
}

ShapeProps.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    courseware: PropTypes.object,
    changeShapeType: PropTypes.func
}

const mapStateToProps = (state) => {
    const courseware = state.courseware.present;
    return {
        courseware
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeShapeType: (shape) => {
            dispatch(changeShapeType(fromJS({
                shape
            })));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShapeProps);
